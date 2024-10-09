# 构建参数和 ENV 的效果一样，都是设置环境变量。所不同的是，ARG 所设置的构建环境的环境变量，
# 在将来容器运行时是不会存在这些环境变量的。但是不要因此就使用 ARG 保存密码之类的信息，
# 因为 docker history 还是可以看到所有值（在index.js中build阶段设置的）
ARG ARC_TYPE

# ARG 用于定义构建时的参数，通过 --build-arg 参数传递，将 package.json 中的 version 设置为环境变量（在index.js中build阶段设置的）
ARG APP_VERSION

# 在Dockerfile中，每一个FROM关键字代表一个阶段，在当前项目中，首次docker构建时会将第一阶段缓存起来，
# 之后每次npm run docker:build都将只执行第二阶段内容，因此后续应当先执行npm run build打包静态资源再docker:build
# 为了方便使用，这里将打包静态资源的操作配置在package.json的script中，会在docker:build命令执行时自动执行
# 第一阶段：使用 Node.js 16版本 安装构建项目
FROM node:16

# ENV 用于设置环境变量，这些变量可以在容器运行时使用，ENV要在FROM之后执行
ENV APP_VERSION=${APP_VERSION}

# 指定docker的工作目录
WORKDIR /docker

# 复制项目的所有文件到工作目录
COPY . .

# 安装依赖并构建项目
RUN npm install
RUN npm run build

# 第二阶段：使用 Nginx 镜像来提供前端服务

# 指定nginx基础镜像（需要在本地拉取该镜像，现在默认是docker pull registry.dg.com/d4/frontend-nginx:0.1.0-arm64）
FROM registry.dg.com/d4/frontend-nginx:0.1.0-${ARC_TYPE}

# 拷贝项目根目录下的/deploy/nginx中所有文件到docker工作目录下的nginx中
COPY /deploy/nginx /docker/nginx

# 拷贝docker工作目录中的nginx下的html中所有文件到/etc/nginx中
RUN cp -r /docker/nginx/html /etc/nginx/

# 暴露80端口作为容器的访问端口
EXPOSE 80

# 使用 dockerize 工具生成Nginx的配置文件 /etc/nginx/nginx.conf，
# 并在生成过程中根据需要替换模板文件中的变量，在容器中启动nginx服务
# 并以非守护进程方式在容器中持续运行，使得容器能够提供Nginx服务并处理来自外部的请求
CMD dockerize -template /docker/nginx/nginx.conf:/etc/nginx/nginx.conf \
    && nginx -g 'daemon off;'