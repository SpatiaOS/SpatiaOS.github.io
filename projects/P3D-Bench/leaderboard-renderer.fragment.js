function m2(groups) {
  const starts = new Set();
  let column = 0;
  groups.forEach((group, index) => {
    if (index > 0) starts.add(column);
    column += group.span;
  });
  return starts;
}

function parseSortableValue(token) {
  const value = Number(token.replace(/[$,!^]/g, ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function rankDisplayedRows(rows, metricCount) {
  const tokens = rows.map((row) => row.cells.trim().split(/\s+/).map((token) => token.replace(/[!^]$/, "")));
  const ranks = Array.from({ length: metricCount }, (_, column) => {
    const values = Array.from(new Set(tokens.map((row) => Number(row[column])).filter(Number.isFinite))).sort((a, b) => b - a);
    return { best: values[0], second: values[1] };
  });
  return rows.map((row, rowIndex) => ({
    ...row,
    cells: tokens[rowIndex].map((token, column) => {
      if (column >= metricCount) return token;
      const value = Number(token);
      if (!Number.isFinite(value)) return token;
      if (value === ranks[column].best) return `${token}!`;
      if (value === ranks[column].second) return `${token}^`;
      return token;
    }).join(" "),
  }));
}

function _2({ token, groupStart, summary }) {
  const className = ["rt-cell", groupStart ? "group-start" : "", summary ? `rt-summary-${summary}` : ""].filter(Boolean).join(" ");
  if (token === "-") return D.jsx("td", { className: `${className} na`, children: "—" });
  if (token.endsWith("!")) return D.jsx("td", { className: `${className} best`, children: token.slice(0, -1) });
  if (token.endsWith("^")) return D.jsx("td", { className: `${className} second`, children: token.slice(0, -1) });
  return D.jsx("td", { className, children: token });
}

function v2() {
  const [view, setView] = Ze.useState("live");
  const subtables = view === "paper" ? d2 : p2;
  return D.jsxs("div", {
    className: "results-tables",
    children: [
      D.jsxs("div", {
        className: "results-view-toggle",
        role: "tablist",
        "aria-label": "Leaderboard version",
        children: [
          D.jsx("button", { type: "button", role: "tab", "aria-selected": view === "paper", className: view === "paper" ? "rv-tab active" : "rv-tab", onClick: () => setView("paper"), children: "Paper results" }),
          D.jsx("button", { type: "button", role: "tab", "aria-selected": view === "live", className: view === "live" ? "rv-tab active" : "rv-tab", onClick: () => setView("live"), children: "Live leaderboard" }),
        ],
      }),
      subtables.map((subtable) => D.jsx(x2, { sub: subtable }, `${view}-${subtable.key}`)),
    ],
  });
}

function x2({ sub }) {
  const groupStarts = m2(sub.groups);
  const headerRows = sub.superGroups ? 3 : 2;
  const scoreIndex = sub.metrics.indexOf("Score");
  const costIndex = sub.metrics.findIndex((metric) => metric.startsWith("USD"));
  const rankedRows = scoreIndex >= 0 ? rankDisplayedRows(sub.rows, scoreIndex) : sub.rows;
  const [sort, setSort] = Ze.useState(scoreIndex >= 0 ? "score-desc" : "default");
  const sortIndex = sort.startsWith("score") ? scoreIndex : sort.startsWith("cost") ? costIndex : -1;
  const rows = sortIndex < 0 ? rankedRows : [...rankedRows]
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const leftValue = parseSortableValue(left.row.cells.trim().split(/\s+/)[sortIndex]);
      const rightValue = parseSortableValue(right.row.cells.trim().split(/\s+/)[sortIndex]);
      const difference = sort.endsWith("asc") ? leftValue - rightValue : rightValue - leftValue;
      return difference || left.index - right.index;
    })
    .map((item) => item.row);

  const sortState = (index) => {
    if (index === scoreIndex) return sort.startsWith("score") ? sort.endsWith("asc") ? "ascending" : "descending" : "none";
    if (index === costIndex) return sort.startsWith("cost") ? sort.endsWith("asc") ? "ascending" : "descending" : "none";
    return undefined;
  };
  const toggleSort = (index) => {
    const kind = index === scoreIndex ? "score" : "cost";
    if (!sort.startsWith(kind)) {
      setSort(kind === "score" ? "score-desc" : "cost-asc");
      return;
    }
    setSort(sort.endsWith("asc") ? `${kind}-desc` : `${kind}-asc`);
  };
  const sortLabel = (index) => {
    const label = index === scoreIndex ? "overall score" : "cost";
    const state = sortState(index);
    const direction = state === "ascending" ? "high to low" : state === "descending" ? "low to high" : index === scoreIndex ? "high to low" : "low to high";
    return `Sort ${label} ${direction}`;
  };
  const sortIndicator = (index) => sortState(index) === "ascending" ? "↑" : sortState(index) === "descending" ? "↓" : "↕";

  const renderRow = (row, domain) => {
    const family = row.family ? Dx[row.family] : undefined;
    const tokens = row.cells.trim().split(/\s+/);
    return D.jsxs("tr", {
      className: domain ? "rt-row rt-domain" : "rt-row",
      children: [
        D.jsx("th", {
          scope: "row",
          className: "rt-model-col",
          children: D.jsxs("span", {
            className: "rt-model",
            children: [
              family ? D.jsx("span", {
                className: "model-mark",
                style: { "--model-tile": family.tile || "#fffdfa", "--icon-filter": family.filter || "none" },
                children: D.jsx("img", { src: Vn(family.icon), alt: "", "aria-hidden": "true" }),
              }) : D.jsx("span", { className: "model-mark rt-mark-empty", "aria-hidden": "true" }),
              D.jsx("strong", { children: row.model }),
            ],
          }),
        }),
        tokens.map((token, column) => D.jsx(_2, {
          token,
          groupStart: groupStarts.has(column),
          summary: column === scoreIndex ? "score" : column === costIndex ? "cost" : undefined,
        }, column)),
      ],
    }, row.model);
  };

  return D.jsxs("div", {
    className: "rt-block",
    style: { "--rt-accent": sub.accent },
    children: [
      D.jsx("div", { className: "rt-block-head", children: D.jsx("span", { className: "rt-tag", children: sub.title }) }),
      D.jsx("div", {
        className: `rt-scroll ${scoreIndex >= 0 ? "has-summary" : ""}`,
        children: D.jsxs("table", {
          className: `results-table ${scoreIndex >= 0 ? "has-summary" : ""}`,
          children: [
            D.jsxs("thead", {
              children: [
                sub.superGroups ? D.jsxs("tr", {
                  className: "rt-superrow",
                  children: [
                    D.jsx("th", { rowSpan: headerRows, className: "rt-model-col rt-corner", children: "Model" }),
                    sub.superGroups.map((group, index) => D.jsx("th", { colSpan: group.span, className: ["rt-super", index > 0 ? "group-start" : "", scoreIndex >= 0 && index === sub.superGroups.length - 1 ? "rt-summary-group" : ""].filter(Boolean).join(" "), children: group.label }, index)),
                  ],
                }) : null,
                D.jsxs("tr", {
                  className: "rt-grouprow",
                  children: [
                    sub.superGroups ? null : D.jsx("th", { rowSpan: 2, className: "rt-model-col rt-corner", children: "Model" }),
                    sub.groups.map((group, index) => D.jsx("th", { colSpan: group.span, className: ["rt-group", index > 0 ? "group-start" : "", scoreIndex >= 0 && index === sub.groups.length - 1 ? "rt-summary-group" : ""].filter(Boolean).join(" "), children: group.label }, index)),
                  ],
                }),
                D.jsx("tr", {
                  className: "rt-metricrow",
                  children: sub.metrics.map((metric, index) => {
                    const summary = index === scoreIndex ? "score" : index === costIndex ? "cost" : undefined;
                    const className = ["rt-metric", groupStarts.has(index) ? "group-start" : "", summary ? `rt-summary-${summary}` : ""].filter(Boolean).join(" ");
                    return D.jsx("th", {
                      className,
                      "aria-sort": sortState(index),
                      children: summary ? D.jsxs("button", {
                        type: "button",
                        className: "rt-summary-sort",
                        "aria-label": sortLabel(index),
                        title: sortLabel(index),
                        onClick: () => toggleSort(index),
                        children: [
                          D.jsx("span", { children: metric }),
                          D.jsx("span", { className: "rt-sort-indicator", "aria-hidden": "true", children: sortIndicator(index) }),
                        ],
                      }) : metric,
                    }, index);
                  }),
                }),
              ],
            }),
            D.jsxs("tbody", { children: [rows.map((row) => renderRow(row, false)), sub.domainRows ? sub.domainRows.map((row) => renderRow(row, true)) : null] }),
          ],
        }),
      }),
      sub.note ? D.jsx("p", { className: "rt-note", children: sub.note }) : null,
    ],
  });
}
