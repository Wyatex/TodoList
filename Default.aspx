<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="todo.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>简单的Todo-List</title>
    <!-- 引入样式 -->
    <link
      rel="stylesheet"
      href="./css/element.css"
    />
    <link
      rel="stylesheet"
      href="./css/default.css"
    />
    <!-- 引入组件库 -->
    <script src="./js/ityped.js"></script>
    <script src="./js/vue.js"></script>
    <script src="./js/element.js"></script>
    <script src="./js/jquery.js"></script>
    <script src="./js/three.js"></script>
    <script src="./js/vue-ityped.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="bg"></div>
    <div id="app">
      <div class="header">
        <div class="header-inner">
          <div class="l-nav">
            <div class="logo"><span>Todo List</span></div>
            <div class="info">
              <a class="a" href="#" @click="switchTo" id="stop">{{topNav}}</a>
            </div>
          </div>
          <div class="r-nav">
            <div class="login">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="需要先登录才能使用TodoList功能哦。"
              >
                <a class="a" href="#" slot="reference" @click="toLogin">登录</a>
              </el-popover>
            </div>
            <div class="register">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="还没有账号吗？来注册一个吧。"
              >
                <a class="a" href="#" slot="reference" @click="toRegister"
                  >注册</a
                >
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="main" v-if="inMain">
          <div class="title"><span>TodoList.io</span></div>
          <div class="discription">
            <span v-typed.showCursor="{typeSpeed: 100}">
              <span>这是一个简洁的TodoList应用</span><br>
              <span>但是并不简陋</span><br>
              <span>点击下面按钮开始使用吧</span><br>
              <span>或者点击左上方的介绍查看使用方法</span>
            </span>
          </div>
          <div class="nav-btn">
            <a href="#" class="a" @click="toRegister" style="margin-right: 30px;">
              <span class="useTodoList">注册并使用</span>
            </a>
            <a href="/todo.aspx" class="a" style="margin-top: 3rem">
              <el-popover
                width="200"
                trigger="hover"
                placement="bottom"
                content="如果需要离线版，建议使用新的Chrome内核浏览器，并安装到本地。"
              >
                <span class="useTodoList" slot="reference">使用离线版</span>
              </el-popover>
            </a>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="introduce" v-if="inIntroduce">
          <div class="aboutMe">
          <el-card>
              <div slot="header" class="clearfix">
                <span>关于我</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="toMyBlog"
                  >我的博客</el-button
                >
              </div>
              <div class="text item">
                我是来自18物联网1班的wyatex，目前在自学前后端技术。前端常用技术栈是Vue+ElementUI，包括这个网站也是使用了Vue框架，一些组件用到了ElementUI的组件。<br />
                当然原生JavaScript和CSS也懂一些啦，可以打开本页面的源代码查看，css样式表就占了200多行，js代码也占了差不多200行。<br />
                后端技术常用技术栈是Go+Goframe框架和Java+SpringBoot框架，而且我还打算了解一下Javascript+Koa框架和Python+Django框架，不过我最喜欢的还是Go，性能比SpringBoot强太多了，所以毕业设计我应该也会用Go来写。<br />
                虽然说是ASP.NET课程，但是因为ASP.NET能提供的功能并不满足我的需求，所以基本上只是用来作为保存TodoList信息的一个途径。<br />
                除此之外我还会一些其他的技术，比如安卓应用开发（java+native和dart+flutter），微服务、云原生的一些原理（还在学），掌握云容器技术的开发，我的理想是成为架构师，，目标是进阿里、腾讯、字节这些大厂。
                所以我的毕业设计想写一个能应付高并发的系统（比如抢课、电商秒杀），作为锻炼项目。
              </div>
            </el-card>
            <el-card style="margin-top: 2rem">
              <div slot="header" class="clearfix">
                <span>关于TodoList</span>
              </div>
              <div class="text item">
                类似的TodoList网页在百度都能找到，但是大部分都比较简陋，所以我打算写一个完善一点的todolist网页。<br />
                提供的功能有分栏管理，比如生活上的、工作上的，这个应用可以将他们分成几个栏目，每个栏目有三个板块，分别是：未开始、进行中、已完成。<br />
                可以向每个未完成的板块添加todo
                item，添加进去的item可以拖动到进行中或者已完成板块，或者拖到垃圾桶进行删除。<br />
                这个灵感来自Github的Projects功能，也是一个类似todo
                list的功能，而且它还有一些其他的功能，但是我觉得这个应用并不是需要那些功能。
              </div>
            </el-card>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <el-row class="loginRegister" v-if="inLogin">
          <el-col :lg="8" :md="10" :xs="16">
            <div class="head"><span>TodoList.io</span></div>
            <el-card class="form">
              <el-form :rules="rules" ref="form" :model="ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="ruleForm.username"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="ruleForm.password"
                    placeholder="请输入密码"
                    type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="确认密码"
                  prop="confirmPassword"
                  v-if="inRegister"
                >
                  <el-input
                    v-model="ruleForm.confirmPassword"
                    placeholder="请输入密码"
                    type="password"
                  ></el-input>
                </el-form-item>
                <div class="control" v-if="!inRegister">
                  <div class="control-btn">
                    <a href="/todo.aspx" style="margin-right: 20px;">
                        <el-button type="primary">登录</el-button>
                    </a>
                    <el-button @click="reset">重置</el-button>
                  </div>
                  <div class="nav" @click="toRegister">
                    <span>还没有账号，注册一个吧！</span>
                  </div>
                </div>
                <div class="control" v-if="inRegister">
                  <div class="control-btn">
                    <a href="/todo.aspx" style="margin-right: 20px;">
                        <el-button type="primary">注册</el-button>
                    </a>
                    <el-button @click="reset">重置</el-button>
                  </div>
                  <div class="nav" @click="toLogin">
                    <span>前往登录！</span>
                  </div>
                </div>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </transition>
      <div class="footer">
        <div class="copyright">© 2021 wyatex All rights Reserved.</div>
        <div class="other">
          来自18物联网1班wyatex用
          <div class="heart">
            <svg
              t="1619336871602"
              id="heart"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2123"
              width="15"
              height="15"
            >
              <path
                fill="red"
                d="M958.815 439.177c0-167.342-112.526-303-251.334-303-63.099 0-120.73 28.073-164.854 74.385-13.235 13.892-35.632 13.02-47.836-1.786-45.524-55.232-108.584-89.431-178.274-89.431-138.807 0-251.334 135.657-251.334 303 0 57.363 16.638 109.439 36.2 156.726C166.56 736.62 434.876 868.96 498.448 898.503a31.977 31.977 0 0 0 27.031-0.023c49.845-23.313 226.385-110.128 333.756-217.802 57.888-58.051 99.58-142.9 99.58-241.501z"
                fill=""
                p-id="2124"
              ></path>
            </svg>
          </div>
          制作
        </div>
      </div>
    </div>
    </form>
    <script src="./js/default.js"></script>
</body>
</html>
