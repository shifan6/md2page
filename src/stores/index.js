import { defineStore } from 'pinia'
import { marked } from 'marked'
import CodeMirror from 'codemirror/lib/codemirror'

import config from '../assets/scripts/config'
import WxRenderer from '../assets/scripts/renderers/wx-renderer'
import DEFAULT_CONTENT from '@/assets/example/markdown.md'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt'
import { setColor, formatDoc, formatCss } from '@/assets/scripts/util'
import defaultTheme from "@/assets/scripts/themes/default-theme"
import zineTheme from "@/assets/scripts/themes/zine-theme"

const defaultKeyMap = CodeMirror.keyMap[`default`]
const modPrefix =
  defaultKeyMap === CodeMirror.keyMap[`macDefault`] ? `Cmd` : `Ctrl`

export const useStore = defineStore(`store`, {
  state: () => ({
    themes: {
      default: defaultTheme,
      zine: zineTheme
    },
    wxRenderer: null,
    output: ``,
    html: ``,
    editor: null,
    cssEditor: null,
    currentPageTheme: 'default',
    citeStatus: false,
  }),
  actions: {
    setEditorValue(data) {
      this.editor.setValue(data)
    },
    setCssEditorValue(data) {
      this.cssEditor.setValue(data)
    },
    setWxRendererOptions(data) {
      this.wxRenderer.setOptions(data)
    },
    setCiteStatus(data) {
      this.citeStatus = data
      localStorage.setItem(`citeStatus`, data)
    },
    setCurrentPageTheme(data) {
      this.currentPageTheme = data
      localStorage.setItem(`pageTheme`, data)
    },

    initEditorState() {
      this.currentPageTheme = localStorage.getItem('pageTheme') || config.pageThemes[0].value
      this.citeStatus = localStorage.getItem(`citeStatus`) === `true`
      this.wxRenderer = new WxRenderer({
        theme: this.themes[this.currentPageTheme],
      })
    },
    initEditorEntity() {
      const editorDom = document.getElementById(`editor`)

      if (!editorDom.value) {
        editorDom.value =
          localStorage.getItem(`__editor_content`) || formatDoc(DEFAULT_CONTENT)
      }
      this.editor = CodeMirror.fromTextArea(editorDom, {
        mode: `text/x-markdown`,
        theme: `xq-light`,
        lineNumbers: false,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        extraKeys: {
          [`${modPrefix}-F`]: function autoFormat(editor) {
            const doc = formatDoc(editor.getValue(0))
            localStorage.setItem(`__editor_content`, doc)
            editor.setValue(doc)
          },
          [`${modPrefix}-B`]: function bold(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`**${selected}**`)
          },
          [`${modPrefix}-D`]: function del(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`~~${selected}~~`)
          },
          [`${modPrefix}-I`]: function italic(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`*${selected}*`)
          },
          [`${modPrefix}-K`]: function italic(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`[${selected}]()`)
          },
          [`${modPrefix}-L`]: function code(editor) {
            const selected = editor.getSelection()
            editor.replaceSelection(`\`${selected}\``)
          },
        },
      })
    },
    initCssEditorEntity() {
      const cssEditorDom = document.getElementById(`cssEditor`)

      if (!cssEditorDom.value) {
        cssEditorDom.value =
          localStorage.getItem(`__css_content`) || DEFAULT_CSS_CONTENT
      }
      this.cssEditor = CodeMirror.fromTextArea(cssEditorDom, {
        mode: `css`,
        theme: `style-mirror`,
        lineNumbers: false,
        lineWrapping: true,
        matchBrackets: true,
        autofocus: true,
        extraKeys: {
          [`${modPrefix}-F`]: function autoFormat(editor) {
            const doc = formatCss(editor.getValue(0))
            localStorage.setItem(`__css_content`, doc)
            editor.setValue(doc)
          },
          [`${modPrefix}-S`]: function save(editor) {},
        },
      })
    },
    editorRefresh() {
      const renderer = this.wxRenderer.getRenderer(this.citeStatus)
      marked.setOptions({ renderer })
      let output = marked.parse(this.editor.getValue(0))

      // 去除第一行的 margin-top
      output = output.replace(/(style=".*?)"/, `$1;margin-top: 0"`)
      if (this.citeStatus) {
        // 引用脚注
        output += this.wxRenderer.buildFootnotes()
        // 附加的一些 style
        output += this.wxRenderer.buildAddition()
      }

      // 根结点样式 (font-size background)
      const currentThemeJson = this.themes[this.currentPageTheme]
      if (currentThemeJson.wrapper) {
        const wrapper = currentThemeJson.wrapper
        let style = ''
        for (let it in wrapper) {
          style += `${it}: ${wrapper[it]}; `
        }
        output = `<div style="${style}">${output}</div>`
      }

      this.output = output
    },
  },
})
