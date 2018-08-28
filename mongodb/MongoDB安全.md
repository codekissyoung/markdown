# MongoDB 安全

## 网络隔离

- `内网` 与 `外网`

## 防火墙配置

- 只允许指定`ip`访问`MongoDB`服务

## 用户名 密码

### 开启auth

- 配置文件中加上

```conf
auth = true
```

- 创建用户

```bash
{
    user:<name>,
    pwd:<password>,
    customData:<any information>,
    roles:[
        {
            role:<role>,
            db:<database>,
        }
    ]
}

# <role> : read , readWrite , dbAdmin , dbOwner , userAdmin

# 示例
> db.createUser({user:"cky",pwd:"Cky951010",roles:[{role:"userAdmin",db:"admin"},{role:"readWrite",db:"test"}]});
Successfully added user: {
	"user" : "cky",
	"roles" : [
		{
			"role" : "userAdmin",
			"db" : "admin"
		},
		{
			"role" : "readWrite",
			"db" : "test"
		}
	]
}
```

## MongoDB用户角色

### 数据库角色

- read
- readWrite
- dbAdmin
- dbOwner
- userAdmin

### 集群角色

- clusterAdmin
- clusterManager

### 备份角色

- backup
- restore

### 其他特殊权限角色

- DBAdminAnyDatabase

### 自定义用户角色

```bash
db.createRole({
    _id : "myApp.appUser",
    role: "appUser",
    privileges : [
        {
            resource : {db:"myApp",collection:""},
            actions : ["find","createCollection","dbStats","collStats"]
        },
        {
            resource : {db:"myApp",collection:"logs"},
            actions : ["insert"]
        }
    ] 
});
```