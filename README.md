# FasterWeb

![LICENSE](https://img.shields.io/github/license/yinquanwang/FasterRunner.svg)
> FasterWeb depend on FasterRunner

## Docker 部署 nginx模式
--------------
``` 
1. 修改default.conf配置文件 server_name的ip(宿主机IP), 端口默认8080
2. 修改/src/restful/api.js baseUrl地址, 即为fastrunner容器运行的宿主机地址
3. 执行npm install, npm run build # 生成生产环境包
3. docker build -t fasterweb:latest .    # 构建docker镜像
4. docker run -d --name fasterweb --net=host --restart always fasterweb:latest  # 后台运行docker容器
5. open url: http://宿主机ip:8080/fastrunner/login
``` 

## 本地开发环境部署

``` bash
1. 修改FasterWeb/src/restful/api.js的baseUrl配置为FasterRunner启动的ip:port
2. npm install 安装依赖包
3. npm run dev 开发环境启动服务
4. open url: http://localhost:8080/fastrunner/login
```

