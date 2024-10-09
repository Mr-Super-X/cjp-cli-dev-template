# 水利移动门户粤政易端

#### ⚡ 使用说明

```bash
# 安装依赖
npm install

# 运行项目
npm run dev

# 打包发布
npm run build

# 打包并预览效果（主要用于内网不通时快速启动本地服务给UI和产品进行效果确认，须连相同wifi）
npm run build:preview

# 启动git commit终端交互工具，并将代码提交到暂存区
yarn commit

# 启动git commit终端交互工具，并将代码提交到版本库
yarn push

# 发布major版本（自动修改package.json version，并自动创建CHANGELOG.md）
yarn release:major

# 发布minor版本（自动修改package.json version，并自动创建CHANGELOG.md）
yarn release:minor

# 发布patch版本（自动修改package.json version，并自动创建CHANGELOG.md）
yarn release:patch

# 打包docker镜像
yarn docker:build

# 保存docker镜像包
yarn docker:save

# 推送docker镜像
yarn docker:push

# 使用docker-compose启动容器进行预览
yarn docker:compose-up

# 使用docker-compose停止up启动的容器
yarn docker:compose-down
```

#### ⚡ git规范

> **遵循git flow工作流**

已集成git flow自动工具，可通过git flow工具命令快速完成操作，请通过git flow version命令查看是否安装，如没有，请使用`git flow init`命令快速安装。

git flow常用命令如下：

```bash
# 查看当前git版本的flow插件支持哪些命令
git flow

# 增加新功能
# 创建feature分支（会自动切换到develop分支并从develop分支创建新的feature分支，并切换到新分支）
git flow feature start 分支名
# 完成feature分支（会自动切换到develop分支合并新分支的代码到develop分支的暂存区，然后删除本地和远端的新分支）
git flow feature finish 分支名

# 提测新功能
# 创建release分支（会自动切换到develop分支并从develop分支创建新的release/v0.1.0分支，并切换到该分支）
git flow release start v0.1.0
# 完成release分支（会自动切换到develop分支合并release/v0.1.0分支代码到develop、master的暂存区，且自动以分支名打上tag标记，如v0.1.0，然后删除本地和远端的release/v0.1.0分支）
git flow release finish v0.1.0

# 提测bug修复
# 创建bugfix分支（会自动切换到develop分支并从develop分支创建bugfix分支，并切换到该分支）
git flow bugfix start 分支名
# 完成bugfix分支（会自动切换到develop分支合并bugfix分支代码到暂存区，并删除该bugfix分支）
git flow bugfix finish 分支名

# 修复线上bug
# 创建hotfix分支（会自动切换到master分支并从master分支创建hotfix分支，并切换到该分支）
git flow hotfix start 分支名
# 完成hotfix分支（与完成release分支类似，最后会自动合并到develop、master的暂存区）
git flow hotfix finish 分支名
```

工作流大致如下（当前系统我们会使用master分支而不是main，理解思想即可）：

1. develop 分支是从 main 中创建的（这两个分支永久存在，其它的都是临时分支）
2. release 分支是从 develop 创建的（一个版本开发完成后，代码合并到develop分支，然后从develop分支创建release分支用于发布提测代码）
3. feature 分支是从 develop 创建的（feature分支用于开发新功能）
4. feature 完成后，它会合并到 develop 分支中
5. release 分支完成后，它将合并到 develop 和 main 中，并创建 tag 版本标识
6. 如果提测阶段检测到问题，则从 develop 分支创建bugfix分支（bugfix分支用于解决测试环境的bug），如果从main分支检测到问题，则从main分支创建hotfix分支（hotfix是为解决线上环境bug而生）
7. 一旦bugfix完成，它会被合并到 develop 分支和 release 分支，hotfix 完成后，它将合并到 develop 和 main 中

按照我们的管理规范，当一个版本功能完成后我们会将代码合并到develop分支，并拉出例如release/v1.0.0分支进行提测，此时意味着一个阶段完成。

此时如果测试检测出新的bug，在bug系统提单后，我们需要创建bugfix分支进行修复，当全部问题修复完成后，先将bugfix合并到release分支（由于git flow插件不会自动将代码合并到release分支，因此我们需要手动合并），再通过git flow bugfix finish命令合并到develop分支，确保 bug 修复首先被集成到即将发布的版本中，然后再将其合并回开发分支，保持了代码的清晰和版本的正确性。

**当该版本所有的问题都解决之后，下一个版本开始前，我们需要使用 `yarn release:minor`（major、minor、patch三选一） 修改package.json版本号并自动生成CHANGELOG.md文档，再通过`git flow release finish`命令来合并代码，这时候会自动打上tag标记，保障重要版本历史的正确性。** 之后将代码推送到远端仓库即可。

git flow学习文档：<https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow#>

> **版本规范**

采用全球公认的[Semantic Versioning](https://semver.org/)规范进行管理。

简单说明一下：

版本分为**x.y.z**三位，如**1.0.0**，前面两位一般跟着产品版本走即可，**大版本用x表示，小版本用y表示，极小版本或者bug修复用z表示**。

> **发布注意事项**

当一个版本完成，在开始下一个版本之前，需要对版本进行迭代，此时也配置了相应的自动修改版本和生成版本改动日志的命令：

```bash
# 自动修改x版本，在上一个x版本基础上+1
yarn release:major
# 自动修改y版本，在上一个y版本基础上+1
yarn release:minor
# 自动修改z版本，在上一个z版本基础上+1
yarn release:patch
```

> **分支命名规范**

由git flow插件创建的分支命名格式为：feature/分支信息
如果你想手动创建，格式也应当遵循以上格式，分支信息以下划线或横杠分隔，如feature/xxx_xxx

> **遵循commit-msg angular规范**

已集成commitizen功能（本人汉化并开发一个脚手架@mi.mikey/create-husky），支持终端输入`yarn commit`打开angular规范的交互选项。

已集成commitlint等功能，请使用`yarn commit`命令创建符合规范的commit msg之后再push到远程仓库，当然你也可以自己输入符合规范的格式进行提交，不符合规范的提交将被阻止。

#### docker部署说明

已创建docker部署相关的npm scripts和deploy目录，测试环境流水线也已创建。如需部署到预发布或生产，步骤如下

```bash
# 打包镜像
npm run docker:build

# 导出镜像包
npm run docker:save

# 将镜像包交给测试进行部署或者自己上堡垒机部署
```

**预发布支持快速部署，已配置快捷命令`npm run deploy:pre`，命令会先打包静态资源，接着构建docker镜像并导出tar压缩包，然后创建预发布部署脚本（在deploy目录下）。接着只需要连接vpn并登录预发布堡垒机上传tar和部署脚本deploy-pre.sh，执行sh deploy-pre.sh即可，操作如下：**

```bash
# 进入镜像包上传目录，以当前迭代v4为例，每个版本都会有个文件夹
cd /home/images/v4
# 上传镜像包
rz -bye
# 上传部署脚本
rz -bye
# 执行部署脚本
sh deploy-pre.sh
```

**生产环境和预发布共用一个镜像仓库，当我们在预发布部署完成后如果需要部署生产，只需要修改生产的compose.yaml即可，这一步交给负责人来处理，开发尽量不动生产**

> **docker-compose说明**

在当前项目中，docker-compose.yml文件配置主要用于快速启动容器访问镜像，可以通过`npm run docker:compose-up`命令来进行模拟调试，防止本地和线上出现较大偏差。启动成功后通过 `http://192.168.1.126:9020/wr-portal-mobile` 进行访问。docker-compose配置对测试环境、预发布、生产均无影响，测试环境的docker-compose.yml配置在流水线中，预发布和生产的配置则在对应的堡垒机中，均与本地的docker-compose.yml无关。

#### 更多vue配置请查看

See [Configuration Reference](https://cli.vuejs.org/config/).
