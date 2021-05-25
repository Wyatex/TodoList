let vue = new Vue({
  el: '#app',
  data: {
    isCollapse: true,
    menuBtnStatus: '展开菜单',
    inAdding: false,
    inTodo: true,
    inSetting: false,
    inEditItem: false,
    currentProject: 0,
    newTodo: '',
    newColumnName: '',
    newItemContent: '',
    columnEditingIndex: 0,
    itemEditingIndex: {
      colIndex: 0,
      itemIndex: 0,
    },
    dialogAddColumnVisible: false,
    dialogEditColumnVisible: false,
    dialogEditItemVisible: false,
    isEditProjectTitle: false,
    editProject: {
      name: '',
      desc: '',
    },
    projectTemplate: [
      {
        value: 'blank',
        label: '空白看板',
        desc: '从一个完全空白的项目板开始，您可以自己添加列和进行设置。',
      },
      {
        value: 'basic',
        label: '基本的看板',
        desc: '基本的看板：选择这个模板，将会默认添加：”代办事项“、”进行中“和“完成”三列。',
      },
    ],
    projectForm: {
      name: '',
      desc: '',
      template: '',
    },
    projects: [],
  },
  methods: {
    collapse() {
      if (this.isCollapse === true) {
        this.isCollapse = false
        this.menuBtnStatus = '收起菜单'
      } else {
        this.isCollapse = true
        this.menuBtnStatus = '展开菜单'
      }
    },
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.inAdding = true
        this.inTodo = false
        this.inSetting = false
      } else if (key === '3') {
        this.inAdding = false
        this.inTodo = false
        this.inSetting = true
      } else if (key.substring(0, 1) === '2') {
        this.currentProject = Number(key.substring(2)) - 1
        this.inAdding = false
        this.inTodo = true
        this.inSetting = false
        console.log(this.currentProject)
      }
    },
    addProject() {
      if (this.projectForm.name === '') {
        ELEMENT.Message({
          message: '请先输入项目面板名再添加',
          type: 'error',
        })
        return
      } else if (this.projectForm.template === '') {
        ELEMENT.Message({
          message: '请先选择一个模板再添加',
          type: 'error',
        })
        return
      }
      if (this.projectForm.template === 'basic') {
        this.projects.push({
          name: this.projectForm.name,
          desc: this.projectForm.desc,
          info: [
            {
              column: '代办事项',
              inAdding: false,
              item: [],
            },
            {
              column: '进行中',
              inAdding: false,
              item: [],
            },
            {
              column: '已完成',
              inAdding: false,
              item: [],
            },
          ],
        })
      } else if (this.projectForm.template === 'blank') {
        this.projects.push({
          name: this.projectForm.name,
          desc: this.projectForm.desc,
          info: [],
        })
      }
      this.projectForm = {
        name: '',
        desc: '',
        template: '',
      }
      this.handleSelect('2-' + this.projects.length)
    },
    openEditProjectTile() {
      this.editProject.name = this.projects[this.currentProject].name
      this.editProject.desc = this.projects[this.currentProject].desc
    },
    editProjectTile() {
      this.projects[this.currentProject].name = this.editProject.name
      this.projects[this.currentProject].desc = this.editProject.desc
      this.isEditProjectTitle = false
    },
    toAddItem(index) {
      this.projects[this.currentProject].info[index].inAdding = true
    },
    addColumn() {
      if (this.newColumnName === '') {
        ELEMENT.Message({
          message: '请先输入栏名称再添加',
          type: 'error',
        })
        return
      }
      this.projects[this.currentProject].info.push({
        column: this.newColumnName,
        inAdding: false,
        item: [],
      })
      this.newColumnName = ''
      this.dialogAddColumnVisible = false
    },
    delCol(colIndex) {
      let name = this.projects[this.currentProject].info[colIndex].column
      this.projects[this.currentProject].info.splice(colIndex, 1)
      ELEMENT.Message({
        message: `栏目 ${name} 删除成功`,
        type: 'success',
      })
    },
    clearCol(colIndex) {
      let name = this.projects[this.currentProject].info[colIndex].column
      this.projects[this.currentProject].info[colIndex].item = []
      ELEMENT.Message({
        message: `栏目 ${name} 清空成功`,
        type: 'success',
      })
    },
    openEditCol(colIndex) {
      this.newColumnName = this.projects[this.currentProject].info[colIndex].column
      this.dialogEditColumnVisible = true
      this.columnEditingIndex = colIndex
    },
    editCol() {
      this.projects[this.currentProject].info[this.columnEditingIndex].column = this.newColumnName
      this.newColumnName = ''
      this.dialogEditColumnVisible = false
    },
    addItem(index) {
      if (this.newTodo === '') {
        ELEMENT.Message({
          message: '请先输入内容再添加',
          type: 'error',
        })
        return
      }
      this.projects[this.currentProject].info[index].item.push(this.newTodo)
      this.projects[this.currentProject].info[index].inAdding = false
      this.newTodo = ''
    },
    delItem(colIndex, itemIndex) {
      this.projects[this.currentProject].info[colIndex].item.splice(
        itemIndex,
        1
      )
    },
    openEditItem(colIndex,itemIndex) {
      this.itemEditingIndex.colIndex = colIndex
      this.itemEditingIndex.itemIndex = itemIndex
      this.newItemContent = this.projects[this.currentProject].info[colIndex].item[itemIndex]
      this.dialogEditItemVisible = true
    },
    editItem() {
      this.projects[this.currentProject].info[this.itemEditingIndex.colIndex].item[this.itemEditingIndex.itemIndex] = this.newItemContent
      this.dialogEditItemVisible = false
    },
    logData() {
      console.log(this.projects)
    },
    saveData() {
      let dataString = JSON.stringify(this.projects)
      localStorage.setItem('data', dataString)
      ELEMENT.Message({
        message: '保存成功',
        type: 'success',
      })
    },
  },
  created() {
    let data = localStorage.getItem('data')
    if (data === null) {
      this.projects = [
        {
          name: '默认项目',
          desc: 'blahblahblah...',
          info: [
            {
              column: '代办事项',
              inAdding: false,
              item: [
                '点击添加项添加代办事项到本栏',
                '鼠标放到添加项旁边的箭头，打开下拉菜单，可以修改栏名称、清空本栏、删除本栏',
              ],
            },
            {
              column: '进行中',
              inAdding: false,
              item: [
                '长按卡片可以拖动到其他的栏',
                '点击右边的垃圾桶按钮可以删除项',
                '双击文字对项内容进行修改'
              ],
            },
            {
              column: '已完成',
              inAdding: false,
              item: [
                '点击上方的修改项目信息可对项目的名称、简介进行修改'
              ],
            },
          ],
        },
      ]
      return
    }
    this.projects = JSON.parse(data)
  },
})
