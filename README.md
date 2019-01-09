# FasterWeb

![LICENSE](https://img.shields.io/github/license/yinquanwang/FasterRunner.svg)
> FasterWeb that depends FasterRunner

## Build Development

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

After Build
-----------

1. open url(recommend chrome): http://localhost:8080/#/fastrunner/register

## Docker 部署
--------------
1. 修改default.conf配置文件 server_name的ip, 注意为当前docker服务宿主机的ip地址！！！
2. 修改/src/restful/api.js baseUrl地址, 即为fastrunner容器运行的宿主机地址
3. 执行npm install, npm run build # 生成生产环境包
3. docker build -t fasterweb:latest .    # 构建docker镜像
4. docker run -d --name fasterweb --net=host --restart always fasterweb:latest  # 后台运行docker容器
5. open url: http://localhost:8082/#/fastrunner/register

## 在线体验地址
-------------
[FasterRunner 接口自动化测试平台](http://39.108.239.78:8082/#/fastrunner/register)
