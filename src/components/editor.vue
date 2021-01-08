<template>
  <div class="div_parent">
    <div id="edt" class="div_edt"></div>

    <div id="toolbar" class="div_toolbar">
      <span class="ql-formats">
        <select class="ql-font"></select>
        <select class="ql-size"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1"></button>
        <button class="ql-header" value="2"></button>
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-direction" value="rtl"></button>
        <select class="ql-align"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <!-- 视频 -->
        <!-- <button class="ql-video"></button> -->
        <!--  -->
        <!-- <button class="ql-formula"></button> -->
      </span>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </div>

    <!-- 另一种方式的编辑器 -->
    <!-- <quill-editor
      id="quill-editor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor> -->
  </div>
</template>

<script>
// 另一种方式的编辑器
// import { quillEditor } from 'vue-quill-editor'
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import '../assets/css/quill.bubble.css'
import '../assets/css/quill.snow.css'
import '../assets/css/quill.core.css'
import Quill from 'quill'
import DivBlot from '../assets/js/DivBlot' // 是否是android app

import Parchment from 'parchment'

Quill.register(DivBlot, true)

const toolbarOptions = [
  // 颜色、背景色、加粗、斜体、下划线、删除线、块引用、代码块、顺序列表
  [
    { color: [] },
    { background: [] },
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    { list: 'ordered' },
    { list: 'bullet' }
  ],

  // 排列格式
  [
    // 对齐方式
    { align: [] },
    // 左、右缩进 1
    { indent: '-1' },
    { indent: '+1' },
    // 从左往右、从右往左
    { direction: 'rtl' },
    // 左下角、右上角
    { script: 'sub' },
    { script: 'super' }
  ],

  // 字体、字号
  [{ font: [] }, { size: ['small', false, 'large', 'huge'] }], // custom dropdown

  // 清除样式
  ['clean']
]

let quill = null
let AndroidApp = false
// 自定义div Blot

export default {
  name: 'editor',
  components: {},
  data () {
    return {
      // content: ``,
      // editorOption: {
      //   debug: "error",
      //   theme: "snow",
      //   placeholder: "啊哈哈哈",
      //   readonly: false,
      //   modules: {
      //     toolbar: "#toolbar",
      //   },
      // },
    }
  },
  methods: {
    // 初始化编辑器
    initQuill () {
      quill = new Quill('#edt', {
        theme: 'snow',
        placeholder: '请编辑备忘录内容...',
        debug: 'error',
        modules: {
          toolbar: '#toolbar'
        }
      })

      // 监听内容变化
      quill.on('text-change', function (delta, oldDelta, source) {
        // 编辑的富文本内容
        const htmlContent = quill.container.firstChild.innerHTML
        console.log('quill on text-change ...................')
        if (AndroidApp) {
          window.Android_Method.onEditorChange(htmlContent)
        }
      })

      // 监听选区变化
      quill.on('selection-change', function (range, oldRange, source) {
        console.log(
          'newRange = ' +
          JSON.stringify(range) +
          '  oldRange = ' +
          JSON.stringify(oldRange) +
          ' source = ' +
          source
        )

        if (AndroidApp) {
          window.Android_Method.onSelectionChange(
            JSON.stringify(range),
            JSON.stringify(oldRange),
            source
          )
        }
      })

      // 修改编辑器高度
      const screenHeight = window.screen.height
      const toolbarHeight = document.getElementById('toolbar').offsetHeight
      const edt = document.getElementById('edt')

      edt.style.marginTop = toolbarHeight + 'px'
      edt.style.height = screenHeight - toolbarHeight + 'px'

      // 编辑器创建完成
      if (AndroidApp) {
        window.Android_Method.onEditorCreate()
      }
    },
    // 失去焦点事件
    onEditorBlur () {
      console.log('quill-ediotr lose focus')
      if (AndroidApp) {
        window.Android_Method.onFocusChange(false)
      }
    },
    // 获得焦点事件
    onEditorFocus () {
      console.log('quill-ediotr get focus')
      if (AndroidApp) {
        window.Android_Method.onFocusChange(true)
      }
    },
    // 主动获取输入的Delta内容
    getContent () {
      // delta content
      const deltaContent = quill.getContents()
      const ops = deltaContent.ops
      console.log('getContent in vue of Delta.ops $' + JSON.stringify(ops))
      return ops
    },
    // 向编辑器设置Delta内容
    setContent (con) {
      quill.setContents(con)
    },
    // 获取输入的html内容
    getPlainHtml () {
      // plain html text 标签会被转义
      const htmlContent = quill.container.firstChild.innerHTML
      console.log('getContent in vue of plain html $' + htmlContent)
      return htmlContent
    },
    // 获取用户选区
    getSelection () {
      const selection = quill.getSelection()
      return selection
    },
    // 主动插入图片
    insertImg (index, width, height, base64) {
      // alert("index ==" + index +"\n width == " +width+ "\n height == "+height +"\n base64== "+base64);

      // console.log(
      //   "insertImg param :index = " +
      //     index +
      //     " width = " +
      //     width +
      //     "height = " +
      //     height
      // );

      // 插入图片父级div唯一id
      const id = 'insert_img_' + Date.parse(new Date())

      // 删除图标
      const deleteIcon =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEbklEQVRoQ91aTWwbVRD+xlgUqSAOHEBEai89cEBIRYILSeSksY2C7SAhqh5QUQoqFwotTRqFntModaoWOIGgERUHBBdqhwivk9RKg4SKRIQ4NBLpoZFStYeqpD8qrlxP9XbteG3v7ntvEyd297Tyznwzn9+372dmCRt0cU+sHYFAL4A2ELeBqc28t64VEK+AacW8LxanaHpyfiNC03pAOByLgJ4IA7wXwA5NrGWAfgI/zFJ20tD0XTPXJsChd5/Gk//3g6gfjN1+A1f5ERbAPIEHT01Q7ue7OpjKBLi39wUUgv0ADgDYpRNEw3YJwFkECxM0NXVdxU+JAEcTb4FxpoGJ1+a6BMJhyqR+lZGQEuBI/AOAvpUBNeY5f0hG+jsvbE8CHE4cA2GsMckpojKGKJs66WbtSoCjff1gPqsYprFmRAcoc37CKYgjAY4musCYbWxWmuiEbsqkLtR61RHgN+OvoUiXNOE3xzzAr9Nv6T/twaoIlKZKwfKlzclIO8oigoUu+xRbTSCSGAZwQht2cx0+JyM1Wg65RsBaYfML0rn+vX1A5xvA6m0gPQXM/b6+9AXW3neA+/eBv/8BfvhRhreEB9t2l1fsCoFI/BBAX8q8kRwBXnm5YjZy0j8JkfzxYxWsq8vAwUPSFAD+hIz0V8KwQiCa+Etpb1NLQKCMJAuYmw8qRK6YdLYXcHyw2uffK8DHn8lhCAuUSb26RoAj8RhAabknLPnY/7Wy02gyj9z8NiWMUHsew4P1tlqjyXEy0pPmCHAk8TWAg0rBhZEriVP3kJvb7okT6ryH4aP1NlrJmxG+ISP1UZmAOGi8qEzAJOEgAfH72KlVzM4964jV3bmKoaP1z/xIELhGRqqNOPz2HlBxWiv5srGbFMZO38Rs7rkqzO7QTQwdqf5NGOhIrzZJDvQQRxJi3hfzv7/LTRLJMzcwfeF5E7Sn6wYGD1v39mtUQXLeWY0KAt8D2O8v+5KXmzTGvxDSBAY+LZ+NK2G8pKaezDniaHwaTHvUfVws3STiZO4kMT8JEM+IEbi8YXsfN6nYk7NLy0/S1T6LgsBtAM+sH6uEEO5ecZSMeCwklZ2tl5P/4HceCwItLqHH4CVu8Wm05Rcyqyh70ddEEOrIY3igfleptZUYzyN3UW0XW5tksdhR3sxd1S7Obv1mbpmM1M4Sgb4kwAPKo9AU22kaJ+P8oEXALJMHMkoEXJPXkIKb9HTOBFyMirJ8cx0pb/0H7Htf/j/WHinNUWiGQ71IJNonJ+B4qN/qsopI+49L/ssq1ii0cGHLJGB1YcSa0KgOjII8PE2WECx0uJYWTRJWN2ZyvZEa4k+I1XZtnMvrW9qVcaPu3K1xb3A0Q3emzMWjS+PdYmqGLo1Hd0bwkzf5trJb49KVsYtMSsB8sa2uzbkNO/zL3/BFBHh/bTfGyU2JgG2Kbc1Gt515y35q4DR8pbJ8HEBMuzgMXAPEesNpUSaXq8rZQllCsgClIrGo8Mk/t+HADGV/mZFhqjx/BFmYGQfzaxYiAAAAAElFTkSuQmCC'

      // 插入图片
      const html =
        "<div id='" +
        id +
        "' style='width:" +
        width +
        ';height:' +
        height +
        ";background-color:#fbfbfb;display:box;box-sizing:border-box;position:relative;'><img class='img_insert' style='position:absolute;' src='data:image/png;base64," +
        base64 +
        "'><img class='img_delete' style='width:20px;height:20px;right:0px;position:absolute;top:0px;' src='" +
        deleteIcon +
        "' onclick=deleteImg(\"" +
        id +
        '")></div>'

      // 测试用
      // let html ="<div id='" +id +"' style='width:" +width +";height:" +height +";background-color:#fbfbfb;display:box;box-sizing:border-box;position:relative;'><img class='img_insert' style='position:absolute;' src='https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1052128009,2663551699&fm=26&gp=0.jpg'><img class='img_delete' style='width:20px;height:20px;right:0px;position:absolute;top:0px;' src='" +deleteIcon +"' onclick=deleteImg(\"" +id +'")></div>';

      quill.insertEmbed(index, 'DivBlot', html)
    },
    // 删除图片
    deleteImg (id) {
      // 移除dom是一个耗时的过程
      const div = document.getElementById(id)
      div.remove()

      // 每次移除一个图片就会产生一个rep格式的delta
      setTimeout(() => {
        const delta = quill.getContents()
        const rep = ',{"insert":{"DivBlot":true}}'
        const after = JSON.stringify(delta).replace(rep, '')
        quill.setContents(JSON.parse(after))
        // 通知android端图片删除完成
        if (AndroidApp) {
          window.Android_Method.onImgDelete(true)
        }
      }, 1200)
    }
  },
  computed: {},
  // 生命周期
  mounted () {
    console.log('editor.vue is mounted')

    if (window.Android_Method != null) {
      AndroidApp = true
    }

    // 获取运行时环境
    const appName = navigator.appName
    const version = navigator.appVersion
    const codeName = navigator.appCodeName
    const ua = navigator.userAgent

    const log =
      'appName = ' +
      appName +
      '\n version = ' +
      version +
      '\n codeName = ' +
      codeName +
      '\n ua = ' +
      ua
    console.log('mylog=====' + log)

    // 初始化quill编辑器
    this.initQuill()
    // 将vue方法挂载到window上
    window.getContent = this.getContent
    window.setContent = this.setContent
    window.getPlainHtml = this.getPlainHtml
    window.getSelection = this.getSelection
    window.insertImg = this.insertImg
    window.deleteImg = this.deleteImg
    window.getDeletIcon = this.getDeletIcon
  },
  destroyed () {
    console.log('editor.vue is destroyed')
    if (AndroidApp) {
      window.Android_Method.onEditorDestroy()
    }
  }
}
</script>

<style scoped>
.div_parent {
  flex-direction: column;
  position: relative;
}
.div_toolbar {
  position: fixed;
  top: 0;
  box-sizing: border-box;
}
.div_edt {
  position: relative;
}

.img_insert {
  position: absolute;
}
.img_delete {
  right: 0;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
}
</style>
