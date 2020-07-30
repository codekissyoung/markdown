# PHP多进程

`PHP`多进程。

## 一个简单例子

```bash
$ppid = posix_getpid();
echo "master process $ppid running\n";
for ( $i = 0; $i < 2; $i++ ){
    $pid = pcntl_fork();
    switch ($pid) {
        case '-1':
            echo "fork error";
            break;
        case '0':
            $child_pid = posix_getpid();
            cli_set_process_title("php-worker");
            $sec = rand(1,10);
            echo "worker $child_pid start sleep $sec seconds\n";
            sleep($sec);
            echo "worker $child_pid exit\n";
            exit();
            break;
    }
}
cli_set_process_title("php master process");
$ret = pcntl_wait($status);
echo "ret: $ret , status $status \n";
echo "master process exit";
```
