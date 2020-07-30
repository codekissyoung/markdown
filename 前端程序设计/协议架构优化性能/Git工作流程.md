## 目的

1. 是为了保证并行开发，成员之间代码彼此没有影响；
1. 可选择性的完整上线某几个功能分支，而不是夹杂着不明确的 commit;
1. 使团队成员对代码管理部署有一个统一的认识
1. 使代码管理职责分散

## 代码环境

- 运营环境 : 云充吧项目实际上线运营的代码环境，该代码环境不允许直接调试修改代码
- 开发环境 : 云充吧内部开发人员用于开发测试的环境，该环境修改代码需确认所在分支，若有他人在修改，需协调好
- 本地环境 : 开发人员所用 pc 部署的环境

## 开发人员名

`qqm` `ouhui` `xhy` `caokaiyan`

## 分支解释及命名规范

- `master` 分支 : 只用于部署在运营环境的分支，该分支不允许直接修改代码，提交 commit(运营环境默认分支)
- `dev` 分支　: 只用于部署在测试环境的分支,该分支不允许直接修改代码，提交 commit(测试环境默认分支)
- 新功能分支 : **从 master 切出**,命名规范为 `开发人员名-功能名-new`
- bug 分支 : **从 master 切出**,命名规范为 `开发人员名-bug名-bug`
- 合并分支 : 从`master`切出，`功能１-功能２-merge`(用于合并功能 1,功能 2)
- 上线合并分支 : 从 master 切出，用于合并且统计要上线的功能,命名`功能1-功能2-bug1-online`
- 协作开发分支 : 从`新功能分支`切出，主要用于多人开发同一个功能，或者几个人基于另一个人开发的情况，其中有一个主导开发者，命名规范`主导开发人员名-协作者名-功能名-new`
- tag 命名格式: 年份.当前的版本号.该版本内 bug 修复版本号
  例如: 16.1.0 表示 16 年第一个版本, 若在此下一个版本前有需要合并紧急修复的版本则版本号更新为 16.1.1 16.1.2...., 下一个大版本号则为 16.2.0, 以此类推

## 新功能流程

```shell
git(master): git checkout -b qqm-feature1-new # 以master为基础，切出新分支，并切换到该分支
```

> `git(master):` 为`oh my zsh`为`git`配置的标识，可以显示当前`git`处于哪个分支上

```shell
git push --set-upstream origin caokaiyan-feature2-new
```

## 开发协作需求

## 假设

- `qqm` 从 `master`　切出分支 `qqm-feature1-new`
- `caokaiyan` 从 `master`　切出分支 `caokaiyan-feature2-new`
- `ouhui` 从 `master`　切出分支 `ouhui-bug1-bug`

### 需求 : 功能开发完请求测试和观察

1. `qqm` 开发完`feature1`,在测试环境切换到`qqm-feature1-new`
2. 请测试人员协助测试
3. 测试不通过，则继续调试，直到通过
4. 测试通过则在 tower 上关于该新功能的列表里评论:开发完毕，功能位于 `qqm-feature1-new` 分支
5. 等待集成，**若需要长期观察，可以将该分支合入`dev`分支**

### 需求：对新功能和 bug 进行持续集成和观察测试

2. 多个功能的持续集成,基于`master`新建`feature1-feature2-merge`分支,合并`qqm-feature1-new`和`caokaiyan-feature2-new`分支，测试功能**若需要长期观察，可以将该分支合入`dev`分支**

### 需求:需要先上线 feature1 和修复 bug1

1. 前提:`qqm-feature1-new` `ouhui-bug1-bug` 均已开发完毕并且通过持续集成测试，能经过`dev`就更好
1. 切出`feature1-bug1-online`分支，该分支依次合并`qqm-feature1-new`　和　`ouhui-bug1-bug`,如果有冲突，解决好冲突，在此分支上测试下整合之后的功能是否正确，不正确则确定出错代码，删除本分支，在原始分支上修改正确后再次进入上线流程
1. `master`合并`feature1-bug1-online`分支，推送到远程库，并添加上线日期 tag
1. 在运营环境更新`master`分支，上线新功能
1. `dev`合并`master`,同步 master 所做的修改
1. **提醒其他人`master`有变更，其他人可看情况，自行在自己未完成开发的分支上合并`master`**

### 需求：feature1 上线后发现重大问题，需要紧急下线，但是不要影响其他已经存在的功能

1. 在运营环境，将版本回退到该重大问题之前的一个上线日期 tag，同时通知运营人员注意功能变更
2. 在测试环境`master`分支切出一个`qqm-feature1-offline-bug`分支,优先注释掉 feature1 功能,或者直接修复
3. 将`qqm-feature1-offline-bug`合并到`master`,推送到远程库，添加上线日期 tag
4. 在运营环境,更新`master`分支
5. `dev`合并`master`,同步 master 所做的修改
6. **提醒其他人`master`有变更，其他人可看情况，自行在自己未完成开发的分支上合并`master`**

### 需求: 两人协作开发一个功能

前提：`xhy`与`caokaiyan`共同开发一个功能 feature2

1. `xhy` 基于`caokaiyan-feature2-new` 切出一个新分支　`caokaiyan-xhy-feature2-new`
2. `caokaiyan-feature2-new` 如果有新的提交，需提醒`xhy`合并`caokaiyan-feature2-new`到`caokaiyan-xhy-feature2-new`
3. 功能开发完毕,`caokaiyan-feature2-new`合并`caokaiyan-xhy-feature2-new`分支
4. 在`caokaiyan-feature2-new`分支上测试，如果没问题，则等待集成，或者合入`dev`分支,或者进入上线流程

### 需求：为每次代码上线提供标记

每次代码上线，需为这次`commit`添加 tag,tag 格式为：`v16.2.3`，`16`是年份，`2`是新功能上线，`3`是 bug 修改

```
git(master) ~ git tag -a v16.4.0 -m 'comment detail'
```

### 需求：上线检查 确保代码一致性 数据表一致性

检查列表:

1. 数据库字段
2. php composer.phar install
3. 初始化脚本 mcs/table/mcs_db_install.sql

### 采用此流程的 git 操作约定

- 所有人只能在自己的分支上进行`git add` `git commit` `git push` `git pull` 等常规操作
- 所有未上线的分支都需要与`master`分支保持同步，所有已经上线的分支不可再与`master`同步，切不可私自删除
- `master`只能合并`上线合并分支`,`bug`分支，整个稳定的`dev`分支
- `dev` 限定不能合并`协作开发分支`
- `协作开发分支`限定只能合并主导开发者的分支，不能合并其他分支
- 定期删除已经上线且稳定的分支
