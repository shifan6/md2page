let baseColor = `#3f3f3f`
let primaryColor = `rgba(0, 152, 116, 0.9)`

export default {
  wrapper: {
    'font-size': `15px`,
    'padding': `30px`,
  },
  BASE: {
    'font-family': 'PingFangSC',
    'text-align': `left`,
    'line-height': `1.75`,
  },
  block: {
    // 一级标题样式
    h1: {
      'font-size': `1.2em`,
      'text-align': `center`,
      'font-weight': `bold`,
      display: `table`,
      margin: `0 auto 1em`,
      padding: `1em 1em 0 1em`,
      color: baseColor,
    },

    // 二级标题样式
    h2: {
      'font-size': `1.2em`,
      'text-align': `center`,
      'font-weight': `bold`,
      display: `table`,
      margin: `3em auto 2em`,
      padding: `0 0.5em`,
      background: primaryColor,
      color: `#fff`,
    },

    // 三级标题样式
    h3: {
      'font-weight': `bold`,
      'font-size': `1.1em`,
      'margin': `0 8px 1em 8px`,
      'line-height': `1.2`,
      'padding-left': `8px`,
      'border-left': `3px solid ${primaryColor}`,
      color: baseColor,
    },

    // 四级标题样式
    h4: {
      'font-weight': `bold`,
      'font-size': `1em`,
      'margin': `0 8px`,
      'line-height': 2,
      color: primaryColor,
    },

    // 段落样式
    p: {
      margin: `0 8px 2em 8px`,
      color: baseColor,
    },

    // 引用样式
    blockquote: {
      'font-style': `normal`,
      'border-left': `none`,
      padding: `1em`,
      'border-radius': `8px`,
      color: `rgba(0,0,0,0.5)`,
      background: `#f7f7f7`,
      margin: `2em 8px`,
    },

    blockquote_p: {
      'letter-spacing': `0.1em`,
      color: `rgb(80, 80, 80)`,
      'font-size': `1em`,
      display: `block`,
    },
    code_pre: {
      'font-size': `14px`,
      'overflow-x': `auto`,
      'border-radius': `8px`,
      padding: `1em`,
      'line-height': `1.5`,
      margin: `10px 8px`,
    },
    code: {
      margin: 0,
      'white-space': `nowrap`,
      'font-family': `Menlo, Operator Mono, Consolas, Monaco, monospace`,
    },

    image: {
      'border-radius': `4px`,
      display: `block`,
      margin: `0.1em auto 0.5em`,
      width: `100% !important`,
    },

    ol: {
      'margin-left': `0`,
      'padding-left': `1em`,
      color: baseColor,
    },

    ul: {
      'margin-left': `0`,
      'padding-left': `1em`,
      'list-style': `circle`,
      color: baseColor,
    },

    footnotes: {
      margin: `0.5em 8px`,
      'font-size': `80%`,
      color: baseColor,
    },

    figure: {
      margin: `1.5em 8px`,
      color: baseColor,
    },
    hr: {
      'border-style': `solid`,
      'border-width': `1px 0 0`,
      'border-color': `rgba(0,0,0,0.1)`,
      '-webkit-transform-origin': `0 0`,
      '-webkit-transform': `scale(1, 0.5)`,
      'transform-origin': `0 0`,
      transform: `scale(1, 0.5)`,
    },
  },
  inline: {
    listitem: {
      'text-indent': `-1em`,
      display: `block`,
      margin: `0.2em 8px`,
      color: baseColor,
    },

    codespan: {
      'font-size': `90%`,
      color: `#d14`,
      background: `rgba(27,31,35,.05)`,
      padding: `3px 5px`,
      'border-radius': `4px`,
      'word-break': `break-all`,
    },

    link: {
      color: `#576b95`,
    },

    wx_link: {
      color: `#576b95`,
      'text-decoration': `none`,
    },

    // 字体加粗样式
    strong: {
      color: primaryColor,
      'font-weight': `bold`,
    },

    table: {
      'border-collapse': `collapse`,
      'text-align': `center`,
      margin: `1em 8px`,
      color: baseColor,
    },

    thead: {
      background: `rgba(0, 0, 0, 0.05)`,
      'font-weight': `bold`,
      color: baseColor,
    },

    td: {
      border: `1px solid #dfdfdf`,
      padding: `0.25em 0.5em`,
      color: baseColor,
    },

    footnote: {
      'font-size': `12px`,
      color: baseColor,
    },

    figcaption: {
      'text-align': `center`,
      color: `#888`,
      'font-size': `0.8em`,
    },
  },
}
