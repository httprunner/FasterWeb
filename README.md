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

1. open url(recommend chrome): http://localhost:8080/fastrunner/register

## Docker 部署
1. 修改default.conf配置文件 server_name的ip, 注意为当前docker服务宿主机的ip地址！！！
2. docker build -t FasterWeb:latest .    # 构建docker镜像
3. docker run -d --name fasterweb --net=host --restart always FasterWeb:latest  # 后台运行docker容器
