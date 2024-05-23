<template>
  <el-dialog
    title=""
    class="upload__dialog"
    :visible="visible"
    @close="$emit('close')"
  >
    <el-tabs type="activeName" v-model="activeName">
      <el-tab-pane class="upload-panel" label="上传" name="upload">
        <el-upload
          drag
          action=""
          :headers="{ 'Content-Type': 'multipart/form-data' }"
          :show-file-list="false"
          :multiple="true"
          accept=".jpg, .jpeg, .png, .gif"
          name="file"
          :before-upload="beforeImageUpload"
          :http-request="uploadImage"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将图片拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane class="github-panel" label="配置 GitHub 图床" name="github">
        <el-form
          class="setting-form"
          :model="formGitHub"
          label-position="right"
          label-width="140px"
        >
          <el-form-item label="GitHub 仓库" :required="true">
            <el-input
              v-model.trim="formGitHub.repo"
              placeholder="如：github.com/yanglbme/resource"
            ></el-input>
          </el-form-item>
          <el-form-item label="分支">
            <el-input
              v-model.trim="formGitHub.branch"
              placeholder="如：release，可不填，默认 master"
            ></el-input>
          </el-form-item>
          <el-form-item label="Token" :required="true">
            <el-input
              v-model.trim="formGitHub.accessToken"
              show-password
              placeholder="如：cc1d0c1426d0fd0902bd2d7184b14da61b8abc46"
            ></el-input>
            <el-link
              type="primary"
              href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"
              target="_blank"
              >如何获取 GitHub Token？
            </el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveGitHubConfiguration"
              >保存配置
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { checkImage, removeLeft } from '@/assets/scripts/util'
import CodeMirror from 'codemirror/lib/codemirror'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: `upload`,

      formGitHub: {
        repo: ``,
        branch: ``,
        accessToken: ``,
      },
      options: [
        {
          value: `default`,
          label: `默认`,
        },
        {
          value: `github`,
          label: `GitHub`,
        }
      ],
      imgHost: `github`,
    }
  },
  created() {
    if (localStorage.getItem(`githubConfig`)) {
      this.formGitHub = JSON.parse(localStorage.getItem(`githubConfig`))
    }
  },
  methods: {
    changeImgHost() {
      localStorage.setItem(`imgHost`, this.imgHost)
      // this.$message.success(`已成功切换图床`)
    },
    saveGitHubConfiguration() {
      if (!(this.formGitHub.repo && this.formGitHub.accessToken)) {
        const blankElement = this.formGitHub.repo ? `token` : `GitHub 仓库`
        this.$message.error(`参数「${blankElement}」不能为空`)
        return
      }
      localStorage.setItem(`githubConfig`, JSON.stringify(this.formGitHub))
      this.$message.success(`保存成功`)
    },

    beforeImageUpload(file) {
      // check image
      const checkResult = checkImage(file)
      if (!checkResult.ok) {
        this.$message.error(checkResult.msg)
        return false
      }
      // check image host
      let imgHost = localStorage.getItem(`imgHost`)
      imgHost = imgHost ? imgHost : `github`
      localStorage.setItem(`imgHost`, imgHost)

      const config = localStorage.getItem(`${imgHost}Config`)
      const isValidHost = imgHost == `default` || config
      if (!isValidHost) {
        this.$message.error(`请先配置 ${imgHost} 图床参数`)
        return false
      }
      return true
    },
    uploadImage(params) {
      this.$emit(`uploadImage`, params.file)
    },
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val === `formCustom`) {
          this.$nextTick(() => {
            const textarea =
              this.$refs.formCustomElInput.$el.querySelector(`textarea`)
            this.formCustom.editor =
              this.formCustom.editor ||
              CodeMirror.fromTextArea(textarea, {
                mode: `javascript`,
              })
            this.formCustom.editor.setValue(this.formCustom.code)
          })
        }
      },
    },
  },
  mounted() {
    this.changeImgHost()
  },
}
</script>

<style lang="less" scoped>
.upload__dialog {
  display: flex;
}

/deep/ .el-dialog {
  width: 55%;
  min-width: 640px;
  min-height: 500px;
  // 消除固定的行内样式，配合 flex 布局居中元素
  margin: auto !important;
}

/deep/ .el-upload-dragger {
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 500px;
  height: 360px;

  .el-icon-upload {
    margin-top: 0;
  }
}

/deep/ .el-dialog__body {
  padding-bottom: 50px;
}

.upload-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .el-select {
    align-self: flex-end;
    margin: 0 67.75px 20px;
    width: 100px;
  }
}

.github-panel {
  display: flex;
  justify-content: center;

  &.formCustom {
    width: 100%;
  }

  .formCustomElInput {
    /deep/ .CodeMirror {
      border: 1px solid #eee;
      height: 300px !important;
      font-family: 'Fira Mono', 'DejaVu Sans Mono', Menlo, Consolas,
        'Liberation Mono', Monaco, 'Lucida Console', monospace !important;
      line-height: 20px;

      .CodeMirror-scroll {
        padding: 10px;
      }
    }
  }
}

.setting-form {
  width: 100%;

  .el-form-item {
    margin: 15px;
  }

  .el-form-item:last-child {
    text-align: right;
  }
}
</style>
