var rules = [
    [
        [
            "open.bigmodel.cn",
            "bigmodel.cn",
            "47.112.125.221",
            "api.moonshot.cn",
            "platform.moonshot.cn",
            "moonshot.cn",
            "kimi.com",
            "edu.cn",
            "zhipin.com",
            "lagou.com",
            "runoob.com",
            "cn.vuejs.org",
            "weibocdn.com",
            "weibo.com",
            "zh.javascript.info",
            "cn.vuejs.org",
            "lixueduan.com",
            "learnku.com",
            "topgoer.com",
            "cnblogs.com",
            "xiaoyusan.com",
            "muchenglin.com",
            "tapd.cn",
            "xinhulu.com",
            "codekissyoung.com",
            "wolai.com",
            "bilibili.com",
            "hdslb.com",
            "bilivideo.com",
            "bilivideo.cn",
            "s1.hdslb.com",
            "baidu.com",
            "sogou.com",
            "so.com",
            "taobao.com",
            "tmall.com",
            "jd.com",
            "pinduoduo.com",
            "weibo.com",
            "zhihu.com",
            "douban.com",
            "iqiyi.com",
            "qq.com",
            "youku.com",
            "sina.com.cn",
            "163.com",
            "sohu.com",
            "csdn.net",
            "juejin.cn",
            "segmentfault.com",
            "oschina.net",
            "infoq.cn",
            "51cto.com",
            "imooc.com",
            "geekbang.org",
            "v2ex.com",
            "ruby-china.org",
            "tencent.com",
            "aliyun.com",
            "12306.cn",
            "58.com",
            "ctrip.com",
            "gitee.com",
            "jianshu.com",
            "toutiao.com",
            "bytedance.com",
            "meituan.com",
            "dianping.com",
            "ele.me",
            "douyin.com",
            "kuaishou.com",
            "xiaohongshu.com",
            "zhaopin.com",
            "51job.com",
            "lagou.com",
            "zhipin.com",
            "liepin.com",
            "hupu.com",
            "yuque.com",
            "shimo.im",
            "teambition.com",
            "tower.im",
            "coding.net",
            "leetcode.cn",
            "nowcoder.com",
            "acwing.com",
            "luogu.com.cn",
            "aliyun.com",
            "baidu.com",
            "chinaso.com",
            "chinaz.com",
            "haosou.com",
            "haygo.com",
            "ip.cn",
            "jike.com",
            "jpush.cn",
            "locql.com",
            "qq.com",
            "simplecd.me",
            "sina.cn",
            "sina.com.cn",
            "sl-reverse.com",
            "so.com",
            "sogou.com",
            "soso.com",
            "syniumsoftware.com",
            "uluai.com.cn",
            "wallproxy.com.cn",
            "weibo.com",
            "yahoo.cn",
            "youdao.com",
            "zhongsou.com",
            "bilivideo.cn"
        ],
        [
            "claude.ai",
            "claudemcpclient.com",
            "claudeusercontent.com",
            "gstatic.com",
            "accounts.google.com",
            "console.anthropic.com",
            "registry.npmjs.org",
            "anthropic.com",
            "ifconfig.me",
            "ipinfo.io",
            "api.anthropic.com",
            "statsig.anthropic.com",
            "sentry.io",
            "ping0.cc",
            "flutter.dev",
            "github.com",
            "github.io",
            "githubassets.com",
            "githubusercontent.com",
            "jetbrains.com",
            "npmjs.com",
            "pub.dev",
            "reactjs.org",
            "unpkg.com",
            "vuejs.org",
        ]
    ]
];

var proxy = 'SOCKS5 127.0.0.1:1081';
var direct = "DIRECT";
var lastRule = '';

function FindProxyForURL(url, host) {
    for (var i = 0; i < rules.length; i++) {
        ret = testHost(i, host);
        if (ret != undefined)
            return ret;
    }
    return proxy;
}

function testHost(index, host) {
    for (var i = 0; i < rules[index].length; i++) {
        for (var j = 0; j < rules[index][i].length; j++) {
            lastRule = rules[index][i][j];
            if (host == lastRule || host.endsWith('.' + lastRule))
                return i % 2 == 0 ? direct : proxy;
        }
    }
    lastRule = '';
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
  };
}