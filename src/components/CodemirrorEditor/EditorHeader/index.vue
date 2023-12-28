<template>
  <el-container class="header-container is-dark">
    <div class="dropdowns">
      <el-dropdown>
        <span class="el-dropdown-link">
          文件<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="refClick">
            <i class="el-icon-upload2"></i>
            导入 .md
            <input hidden type="file" ref="fileInput" accept=".md" />
          </el-dropdown-item>
          <el-dropdown-item @click.native="$emit('download')">
            <i class="el-icon-download"></i>
            导出 .md
          </el-dropdown-item>
          <el-dropdown-item @click.native="$emit('export')">
            <i class="el-icon-document"></i>
            导出 .html
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <span class="el-dropdown-link">
          格式<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="format-item"
            v-for="{ label, kbd, emitArgs } in formatItems"
            :key="kbd"
            @click.native="$emit(...emitArgs)"
          >
            {{ label }}
            <kbd>{{ kbd }}</kbd>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <span class="el-dropdown-link">
          编辑<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$emit('show-dialog-upload-img')">
            <i class="el-icon-upload"></i>
            上传图片
          </el-dropdown-item>
          <el-dropdown-item @click.native="$emit('show-dialog-form')">
            <i class="el-icon-s-grid"></i>
            插入表格
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dropdown>
      <span class="el-dropdown-link">
        主题<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            v-for="{ value, label } in config.pageThemes"
            :key="label"
            @click.native="pageThemeChanged(value)"
        >
          <i
              class="el-icon-check"
              :style="{ opacity: currentPageTheme === value ? 1 : 0 }"
          ></i>
          {{ label }}
        </el-dropdown-item>
        <el-dropdown-item divided class="padding-left-3" @click.native="customStyle">
          自定义 CSS
        </el-dropdown-item>
        <el-dropdown-item
            class="padding-left-3"
            @click.native="showResetConfirm = true"
        >
          重置
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="statusChanged">
          <i
              class="el-icon-check"
              :style="{ opacity: citeStatus ? 1 : 0 }"
          ></i>
          微信外链转底部引用
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button size="medium" @click="copy" type="text">
      <i class="el-icon-document-copy"></i>
      复制
    </el-button>
    <el-button size="medium" @click="share" type="text">
      <i class="el-icon-share"></i>
      分享
    </el-button>

    <reset-dialog
      :show-reset-confirm="showResetConfirm"
      @confirm="confirmReset"
      @close="cancelReset"
    ></reset-dialog>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStore } from '@/stores'
import html2canvas from "html2canvas"
import { Loading } from 'element-ui';

import { solveWeChatImage, mergeCss } from '@/assets/scripts/converter'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt'
import config from '@/assets/scripts/config'
import ResetDialog from './ResetDialog'
import StyleOptionMenu from './StyleOptionMenu'

export default {
  name: `editor-header`,
  data() {
    return {
      config,
      citeStatus: false,
      showResetConfirm: false,
      form: {
        dialogVisible: false,
        title: ``,
        desc: ``,
        thumb: ``,
        content: ``,
      },
      formatItems: [
        {
          label: `加粗`,
          kbd: `Ctrl/Command + B`,
          emitArgs: [`addFormat`, `**`],
        },
        {
          label: `斜体`,
          kbd: `Ctrl/Command + I`,
          emitArgs: [`addFormat`, `*`],
        },
        {
          label: `删除线`,
          kbd: `Ctrl/Command + D`,
          emitArgs: [`addFormat`, `~~`],
        },
        {
          label: `超链接`,
          kbd: `Ctrl/Command + K`,
          emitArgs: [`addFormat`, `[`, `]()`],
        },
        {
          label: `格式化`,
          kbd: `Ctrl/Command + F`,
          emitArgs: [`formatContent`],
        },
      ],
    }
  },
  components: {
    StyleOptionMenu,
    ResetDialog,
  },
  computed: {
    ...mapState(useStore, {
      output: (state) => state.output,
      editor: (state) => state.editor,
      cssEditor: (state) => state.cssEditor,
      themes: (state) => state.themes,
      currentPageTheme: (state) => state.currentPageTheme,
      currentCiteStatus: (state) => state.citeStatus,
    }),
  },
  methods: {
    refClick() {
      this.$refs.fileInput.click()
    },

    pageThemeChanged(themeName) {
      const theme = this.themes[themeName]
      this.setWxRendererOptions({
        theme: theme,
      })
      this.setCurrentPageTheme(themeName)
      this.$emit(`refresh`)
    },

    statusChanged() {
      this.citeStatus = !this.citeStatus
      this.setCiteStatus(this.citeStatus)
      this.$emit(`refresh`)
    },

    // 分享图片
    share() {
      try {
        // 生成图片URL
        let loadingInstance = Loading.service({ fullscreen: true, text: '图片生成中...' })
        const element = document.querySelector('#output-wrapper .preview')
        html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          imageTimeout: 0,
        }).then(canvas => {
          const dataUrl = canvas.toDataURL()
          const link = document.createElement('a')
          const date = new Date()
          const fileName = 'page-' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '.png'
          link.download = fileName
          link.href = dataUrl
          link.click()
          loadingInstance.close()
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    // 复制到微信公众号
    copy() {
      this.$emit(`startCopy`)
      setTimeout(() => {
        solveWeChatImage()

        const clipboardDiv = document.getElementById(`output`)
        clipboardDiv.innerHTML = mergeCss(clipboardDiv.innerHTML)

        // 调整 katex 公式元素为行内标签，目的是兼容微信公众号渲染
        clipboardDiv.innerHTML = clipboardDiv.innerHTML
          .replace(
            /class="base"( style="display: inline")*/g,
            `class="base" style="display: inline"`
          )
          // 公众号不支持 position， 转换为等价的 translateY
          .replace(/top:(.*?)em/g, `transform: translateY($1em)`)

        clipboardDiv.focus()
        window.getSelection().removeAllRanges()
        let range = document.createRange()
        range.setStartBefore(clipboardDiv.firstChild)
        range.setEndAfter(clipboardDiv.lastChild)
        window.getSelection().addRange(range)
        document.execCommand(`copy`)
        window.getSelection().removeAllRanges()
        clipboardDiv.innerHTML = this.output
        // 输出提示
        this.$notify({
          showClose: true,
          message: `已复制渲染后的文章到剪贴板，可直接到公众号后台粘贴`,
          offset: 80,
          duration: 1600,
          type: `success`,
        })
        this.$emit(`refresh`)
        this.$emit(`endCopy`)
      }, 350)
    },

    // 自定义CSS样式
    async customStyle() {
      this.$emit(`showCssEditor`)
      this.$nextTick(() => {
        if (!this.cssEditor) {
          this.cssEditor.refresh()
        }
      })
      setTimeout(() => {
        this.cssEditor.refresh()
      }, 50)

      let flag = localStorage.getItem(`__css_content`)
      if (!flag) {
        this.setCssEditorValue(DEFAULT_CSS_CONTENT)
      }
    },

    // 重置样式
    confirmReset() {
      this.showResetConfirm = false
      localStorage.clear()
      this.cssEditor.setValue(DEFAULT_CSS_CONTENT)
      this.citeStatus = false
      this.statusChanged(false)
      this.pageThemeChanged(this.config.pageThemes[0].value)
      this.$emit(`cssChanged`)
    },
    cancelReset() {
      this.showResetConfirm = false
      this.editor.focus()
    },
    ...mapActions(useStore, [
      `setCurrentPageTheme`,
      `setCiteStatus`,
      `setCssEditorValue`,
      `setWxRendererOptions`,
    ]),
  },
  mounted() {
    this.citeStatus = this.currentCiteStatus

    const fileInput = this.$refs.fileInput
    fileInput.onchange = () => {
      const file = fileInput.files[0]
      if (file == null) {
        return
      }
      const read = new FileReader()
      read.readAsText(file)
      read.onload = () => {
        this.$emit(`import-md`, read.result)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.header-container {
  padding: 10px 20px;
  align-items: center;
}

.dropdowns {
  flex: 1;
}

.el-dropdown {
  margin: 0 10px;
}

.el-dropdown-link {
  cursor: pointer;
}

.padding-left-3 {
  padding-left: 3em;
}

// 添加边距影响了 divided 行的移入效果，此处做一个兼容处理
.el-dropdown-menu__item--divided.padding-left-3 {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3em;
    height: 6px;
    background: white;
  }
}

.format-item {
  .padding-left-3;
  width: 180px;

  kbd {
    font-size: 0.75em;
    float: right;
    color: #666;
  }
}
</style>
