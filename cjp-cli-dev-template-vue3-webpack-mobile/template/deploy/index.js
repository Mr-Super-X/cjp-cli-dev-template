/**
 * 该文件为docker部署的命令配置文件，目前配置了build、save、push三个命令，
 * 主要为了简化npm scripts配置，并且在这里能更灵活的自定义配置。
 *
 * 使用方法：
 *
 *    build：npm run docker:build
 *    save：npm run docker:save
 *    push：npm run docker:push
 *
 * 其中build命令支持额外参数，使用--指定要传递的参数，如-- -a，非必传，支持如下参数：
 *
 *    -a 后面加arm64表示指定arm64架构的包，默认为arm64，目前支持指定['arm64', 'amd64']。可在choices中修改，指定后会追加在镜像版本后如0.1.0-arm64，且platform会被设置为linux/arm64
 *    -n 后面加wr表示在镜像名称上增加wr字符标识（这边wr表示水利项目的意思），默认为空字符，目前支持指定['wr']，可在choices中修改，指定后会追加在镜像名称后，如am-portal-mobile-yzy-fe会变成am-portal-mobile-yzy-wr-fe
 *    -no-cache 用于控制构建是否使用缓存（当发现修改根目录下的.env文件不生效时请使用该参数）
 */
const process = require('node:process') // node自带
const childProcess = require('node:child_process') // node自带，用于执行shell命令
const path = require('node:path') // node自带
const { Command, Option, program } = require('commander') // 需要安装commander依赖
const packageJson = require('../package.json')
// 当前文件路径
const dirname = __dirname
// docker文件路径
const dockerFilePath = path.resolve(dirname, 'docker', 'Dockerfile')
// 镜像名称
const imageName = name => `registry.dg.com/d4/${packageJson.name.replace('-fe', '')}${name ? '-' + name : ''}-fe`
// 镜像版本号
const imageVersion = arc => `${packageJson.version}-${arc}`
// 指定cpu架构，默认arm64，可以使用npm run docker:build -- -a <架构版本，如arm64>，choices里面定义可选参数
const arcOption = new Option('-a, --arc <arc>', 'build arc version').choices(['arm64', 'amd64']).default('arm64')
// 指定项目名称标识，默认无，可以使用npm run docker:build -- -n <标识，如wr>，choices里面定义可选参数
const nameOption = new Option('-n, --name <arc>', 'build project name identifying').choices(['wr']).default('')
// --no-cache选项，可以使用npm run docker:build -- -no-cache，用于控制构建是否使用缓存（当发现修改根目录下的.env文件不生效时请使用该参数）
const noCacheOption = new Option('-no-cache', 'build without cache').default(false)
program
  .version('1.0.0', '-v, --version')
  .description('执行docker')
  .addCommand(
    new Command()
      .name('build')
      .description('打包docker镜像')
      .addOption(arcOption)
      .addOption(nameOption)
      .addOption(noCacheOption)
      .action(options => {
        // 构建docker镜像的命令行参数
        const dockerArgs = [
          'build',
          // 指定平台和cpu架构
          `--platform=linux/${options.arc}`,
          // 构建时传入参数ARC_TYPE=arm64（Dockerfile中需要用）
          `--build-arg ARC_TYPE=${options.arc}`,
          // 构建时传入参数 APP_VERSION=x.y.z（Dockerfile中需要用）
          `--build-arg APP_VERSION=${packageJson.version}`,
          // -t 指定镜像名称和版本
          `-t ${imageName(options.name)}:${imageVersion(options.arc)}`,
          // -f 指定 Dockerfile 所在路径
          `-f ${dockerFilePath}`,
          // 让当前脚本运行时指向的路径为项目根目录（npm run docker:build在根目录运行），否则Dockerfile会报错找不到要拷贝的文件
          process.cwd(), // 当前上下文为根目录
        ]

        // 如果--no-cache被指定，添加--no-cache选项到dockerArgs
        if (options.NoCache) {
          dockerArgs.push('--no-cache')
        }

        // 执行命令
        childProcess.spawn('docker', dockerArgs, { stdio: 'inherit', shell: true })
      })
  )
  .addCommand(
    new Command()
      .name('save')
      .description('保存docker镜像')
      .addOption(arcOption)
      .addOption(nameOption)
      .action(options => {
        childProcess.spawn(
          'docker',
          [
            'save',
            `${imageName(options.name)}:${imageVersion(options.arc)}`,
            '>',
            `./deploy/auto-generate/${packageJson.name}-v${imageVersion(options.arc)}.tar`,
          ],
          { stdio: 'inherit', shell: true }
        )
      })
  )
  .addCommand(
    new Command()
      .name('push')
      .description('推送docker镜像')
      .addOption(arcOption)
      .addOption(nameOption)
      .action(options => {
        childProcess.spawn('docker', ['push', `${imageName(options.name)}:${imageVersion(options.arc)}`], {
          stdio: 'inherit',
          shell: true,
        })
      })
  )
  .parse(process.argv)
