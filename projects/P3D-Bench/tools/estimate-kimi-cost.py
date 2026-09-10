#!/usr/bin/env python3
"""Recount saved Kimi text with the official vocabulary and XTML formatter.

Install tiktoken and obtain the pinned tokenizer files listed in the audit.
No weights, generation requests or evaluation requests are used.
"""
import ast, base64, collections, hashlib, importlib.util, json, math, sys, typing
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

import argparse, subprocess
parser = argparse.ArgumentParser(description="Estimate missing Kimi generation usage from saved artifacts and its official tokenizer; makes no model calls.")
parser.add_argument('--tokenizer-dir', type=Path, required=True)
parser.add_argument('--benchmark-repo', type=Path, required=True)
parser.add_argument('--snapshot-directory', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--private-ledger', type=Path, required=True)
args = parser.parse_args()
ROOT, REPO, SNAPSHOT = args.tokenizer_dir, args.benchmark_repo, args.snapshot_directory
sys.path.insert(0, str(REPO))
import tiktoken
from model.tasks import get_task
from model.cad_formats import get_format

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def local(path): return Path(path.replace('/mnt/CFS/yangyikang/cad_dataset/', '/share/yyk/3dagent/cad_dataset/'))

assert json.loads((ROOT/'model-info.json').read_text())['sha']=='f831ab66814297da540d832a5235f8e904f29d06'
for filename, expected in {
    'tiktoken.model':'b6c497a7469b33ced9c38afb1ad6e47f03f5e5dc05f15930799210ec050c5103',
    'tokenization_kimi.py':'f28ea66e2d862a2a5814970b2ce40c2f7d8296ff09aed90a7e7def689b906944',
    'tokenizer_config.json':'5d0803c94db9cd78763499e0956c95fd5a225c14a727e5a6cf5db3f96f010a6e',
    'encoding_k3.py':'49ff03305fdc4be26867972788d36150b67f8a9e852e62bb7959d87482223676'
}.items():
    assert digest(ROOT/filename)==expected, 'official tokenizer file hash mismatch: '+filename
vision=json.loads((ROOT/'preprocessor_config.json').read_text())['media_proc_cfg']
assert vision['patch_size']==14 and vision['merge_kernel_size']==2 and vision['fixed_output_tokens'] is None

# Parse the published vocabulary/pattern as data; no model weights are loaded.
tree = ast.parse((ROOT/'tokenization_kimi.py').read_text())
pattern = next(n.value for n in ast.walk(tree) if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id=='pat_str' for t in n.targets))
pattern = '|'.join(ast.literal_eval(pattern.args[0]))
vocab = {base64.b64decode(line.split()[0]): int(line.split()[1]) for line in (ROOT/'tiktoken.model').read_bytes().splitlines()}
config = json.loads((ROOT/'tokenizer_config.json').read_text())
special = {v['content']:int(k) for k,v in config['added_tokens_decoder'].items()}
enc = tiktoken.Encoding(name='kimi-k3-official', pat_str=pattern, mergeable_ranks=vocab, special_tokens=special)
assert enc.decode(enc.encode_ordinary('中文 test 123 CadQuery')) == '中文 test 123 CadQuery'

# The official XTML formatter imports only Python standard-library helpers.
tree = ast.parse((ROOT/'encoding_k3.py').read_text())
assert all(not isinstance(n,(ast.Import,ast.ImportFrom)) or (n.module if isinstance(n,ast.ImportFrom) else n.names[0].name) in ['__future__','json','dataclasses','typing'] for n in tree.body)
spec = importlib.util.spec_from_file_location('encoding_k3', ROOT/'encoding_k3.py')
encoding = importlib.util.module_from_spec(spec);sys.modules[spec.name]=encoding;spec.loader.exec_module(encoding)

node = next(n for n in ast.parse((REPO/'model/llm/retry.py').read_text()).body if isinstance(n,ast.FunctionDef) and n.name=='_build_retry_prompt')
ns = {k:getattr(typing,k) for k in ['List','Dict','Any','Optional']}
exec(compile(ast.Module(body=[node],type_ignores=[]),'retry_prompt','exec'),ns)
retry_prompt = ns['_build_retry_prompt']

def count(text): return len(enc.encode_ordinary(text))
def segments_count(segments):
    return sum(len(enc.encode(s.text,allowed_special='all')) if s.allow_special else count(s.text) for s in segments)

def chat_tokens(system, prompt, size):
    image = f'<|media_begin|>image {size}x{size}<|media_content|><|media_pad|><|media_end|>'
    messages = [{'role':'system','content':system},{'role':'user','content':[{'type':'text','text':prompt},{'type':'image_url','image_url':{'url':'saved_image'}}]}]
    segments = encoding.build_chat_segments(messages,thinking=True,image_prompts=[image])
    # K3's published patch=14, merge=2; all considered images are below resizing limits.
    image_tokens = math.ceil(size/28)**2
    return segments_count(segments) + image_tokens - 1

raw = (SNAPSHOT/'full_results.json').read_bytes()
full = json.loads(raw)
task = get_task('text_image2cad')
historical_formats = subprocess.check_output(['git','show','1a3b9e6:model/cad_formats.py'],cwd=REPO,text=True)
historical_ns = {}
exec(compile(historical_formats, 'historical_cad_formats', 'exec'), historical_ns)
system_prompts = {fmt:historical_ns['get_format'](fmt).system_prompt for fmt in ['cadquery','openscad']}
# User and error-feedback templates have been verified unchanged since this revision.
for source_file, class_name, function_name in [('model/tasks.py','TextImageToCADTask','build_prompt'),('model/llm/retry.py',None,'_build_retry_prompt')]:
    def selected_ast(source):
        tree=ast.parse(source)
        if class_name: tree=next(n for n in ast.walk(tree) if isinstance(n,ast.ClassDef) and n.name==class_name)
        return ast.dump(next(n for n in ast.walk(tree) if isinstance(n,ast.FunctionDef) and n.name==function_name))
    historical=subprocess.check_output(['git','show','1a3b9e6:'+source_file],cwd=REPO,text=True)
    assert selected_ast(historical)==selected_ast((REPO/source_file).read_text()), 'prompt template changed'

def estimate_case(job):
    fmt, c = job
    cad = get_format(fmt)
    original = task.build_prompt(cad,text_prompt=c['condition_text'],is_assembly=True)
    attempts = []
    for index,h in enumerate(c['attempt_history']):
        code_path = local(h['generated_code_path']);meta_path=local(h['response_meta_path']);meta=json.loads(meta_path.read_text())
        assert meta['model']=='kimi-k3' and not meta['usage']
        reasoning_path=meta_path.parent/'reasoning.txt';reasoning=reasoning_path.read_text();code=code_path.read_text()
        stream=meta['stream_meta'];assert abs(len(reasoning)-stream['reasoning_chars'])<=2,(c['case_id'],index,len(reasoning),stream['reasoning_chars'])
        answer=code;recovery='saved_code'
        lang='python' if fmt=='cadquery' else 'scad'
        for candidate,kind in [(code,'saved_code'),(f'```{lang}\n{code}\n```','code_fence'),(f'```{lang}\n{code}```','code_fence_no_newline')]:
            if len(candidate)==stream['text_chars']:
                answer=candidate;recovery=kind;break
        if len(answer)!=stream['text_chars']:recovery='saved_code_with_unrecovered_response_text'
        if index:
            prev=c['attempt_history'][index-1]
            detail={k:prev.get('error_'+k) for k in ['traceback','line_number','line_text','stage']};detail['error_type']=prev.get('error_type')
            prompt=retry_prompt(original,local(prev['generated_code_path']).read_text(),prev['errors'],cad,has_images=True,error_detail=detail,repeated_error_count=prev.get('repeat_count',1))
        else:prompt=original
        inp=chat_tokens(system_prompts[fmt],prompt,1024)
        r_tokens=count(reasoning);a_tokens=count(answer)
        assistant=[{'role':'assistant','reasoning_content':reasoning,'content':answer}]
        serialized=segments_count(encoding.build_chat_segments(assistant,add_generation_prompt=False,thinking=True))
        prefix=segments_count(encoding.build_chat_segments([],add_generation_prompt=True,thinking=True))
        out=serialized-prefix
        assert out>=r_tokens+a_tokens
        attempts.append({'attempt':index+1,'input_tokens_estimated':inp,'input_tokens_image512':chat_tokens(system_prompts[fmt],prompt,512),
            'input_tokens_image1536':chat_tokens(system_prompts[fmt],prompt,1536),'reasoning_tokens_recounted':r_tokens,'answer_tokens_recounted':a_tokens,
            'output_tokens_estimated':out,'response_text_recovery':recovery,'response_chars_unrecovered':stream['text_chars']-len(answer),
            'cost_usd_estimated':(inp*3+out*15)/1e6,'code_sha256':digest(code_path),'reasoning_sha256':digest(reasoning_path),'response_meta_sha256':digest(meta_path),
            'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),'code_path':str(code_path),'reasoning_path':str(reasoning_path)})
    return {'case_id':c['case_id'],'format':fmt,'valid':c['valid'],'attempts':attempts,'cost_usd_estimated':sum(a['cost_usd_estimated'] for a in attempts)}

jobs=[(fmt,c) for fmt in ['cadquery','openscad'] for c in full['text_image2cad/kimi_k3-reason/'+fmt]['cases'] if not c.get('llm_failed')]
with ThreadPoolExecutor(max_workers=8) as pool:ledger=list(pool.map(estimate_case,jobs))
args.private_ledger.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
formats={}
for fmt in ['cadquery','openscad']:
    cases=[c for c in ledger if c['format']==fmt];attempts=[a for c in cases for a in c['attempts']]
    totals={k:sum(a[k] for a in attempts) for k in ['input_tokens_estimated','input_tokens_image512','input_tokens_image1536','output_tokens_estimated','reasoning_tokens_recounted','answer_tokens_recounted']}
    total=sum(c['cost_usd_estimated'] for c in cases)
    formats[fmt]={'tested_cases':len(cases),'generation_requests':len(attempts),'valid_cases':sum(c['valid'] for c in cases),'token_totals_estimated':totals,
        'total_usd_estimated':total,'usd_per_case_estimated':total/len(cases),
        'all_input_cached_1024_usd_per_case':(totals['input_tokens_estimated']*.3+totals['output_tokens_estimated']*15)/1e6/len(cases),
        'image512_uncached_usd_per_case':(totals['input_tokens_image512']*3+totals['output_tokens_estimated']*15)/1e6/len(cases),
        'image1536_uncached_usd_per_case':(totals['input_tokens_image1536']*3+totals['output_tokens_estimated']*15)/1e6/len(cases)}
report={'model_id':'kimi_k3','usage_kind':'estimated_official_tokenizer','source_full_results_sha256':hashlib.sha256(raw).hexdigest(),
    'official_tokenizer_repository':'moonshotai/Kimi-K3','official_tokenizer_revision':json.loads((ROOT/'model-info.json').read_text())['sha'],
    'tokenizer_files_sha256':{f:digest(ROOT/f) for f in ['tiktoken.model','tokenization_kimi.py','tokenizer_config.json','encoding_k3.py','preprocessor_config.json','media_utils.py']},
    'formats':formats,'usd_per_case_estimated':sum(f['usd_per_case_estimated'] for f in formats.values())/2,
    'response_recovery_counts':dict(collections.Counter(a['response_text_recovery'] for c in ledger for a in c['attempts'])),
    'response_chars_unrecovered':sum(a['response_chars_unrecovered'] for c in ledger for a in c['attempts'])}
report['assumptions'] = {
    'image_size_pixels':[1024,1024], 'image_tokens_per_request':1369, 'cached_input_tokens':0,
    'image_size_is_assumed':True, 'original_input_images_available':False,
    'source':'Saved condition text, prior generated code, error feedback, historical system prompts and unchanged user/refine templates. Official K3 tokenizer and XTML framing recount saved reasoning and answer text.',
    'limits':'Estimate, not API-reported usage or an invoice. Original full request bodies, images and cache-hit counters are unavailable. Two responses have 17 answer characters not reconstructed. Code fences restored where lengths match. Original API serialization or tokenizer revision may differ.'}
report['official_pricing'] = {'input_usd_per_million':3,'cached_input_usd_per_million':0.3,'output_usd_per_million':15,
    'checked_at':'2026-09-10','source':'https://platform.kimi.ai/docs/pricing/chat-k3','supporting_source':'https://www.kimi.ai/blog/kimi-k3'}
report['formula']='Mean of CadQuery/OpenSCAD per-tested-case generation costs; includes initial/correction and invalid cases, excludes API failed. Reasoning is counted exactly once.'
report['benchmark_prompt_revision']='1a3b9e6'
report['benchmark_source_sha256']={f:digest(REPO/f) for f in ['model/tasks.py','model/cad_formats.py','model/llm/retry.py']}
args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
