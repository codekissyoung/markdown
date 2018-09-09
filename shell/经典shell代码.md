# 经典 shell 代码

## 执行一个命令 直到命令运行成功

```bash
function repeat ()
{
    while : ; # : 总会返回0的退出码 比 true 快
    do  
        $@ && return ;
        sleep 5; # 如果失败了,那么就再延迟5秒，再循环执行命令
    done
}
#　eg.
repeat wget -c http://www.xunlei.com/software-aa.tar.gz
```

## 创建一个临时交换空间 (类似于swap分区)

```bash
# 创建一个交换文件，参数为创建的块数量（不带参数则为默认），一块为1024B（1K）
ROOT_UID=0         # Root 用户的 $UID 是 0.    
E_WRONG_USER=65    # 不是 root ?    
FILE=/swap    
BLOCKSIZE=1024    
MINBLOCKS=40    
SUCCESS=0
# 这个脚本必须用root来运行,如果不是root作出提示并退出    
if [ "$UID" -ne "$ROOT_UID" ];then    
  echo "必须使用root用户运行";   
  exit $E_WRONG_USER    
fi     
      
blocks=${1:-$MINBLOCKS} # 如果 $1 为空， 则默认值   

# 最少要有 40 个块长，如果带入参数比40小，将块数仍设置成40  
if [ "$blocks" -lt $MINBLOCKS ];then
  blocks=$MINBLOCKS  
fi

echo "Creating swap file of size $blocks blocks (KB)."

# 使用 /dev/zero 填充文件
dd if=/dev/zero of=$FILE bs=$BLOCKSIZE count=$blocks 

mkswap $FILE $blocks             # 将此文件建为交换文件（或称交换分区）.    
swapon $FILE                     # 激活交换文件.    
    
echo "Swap file created and activated."    
exit $SUCCESS
```

## 为特定的目的而用零去填充一个指定大小的文件

```bash
#!/bin/bash    
# 如挂载一个文件系统到环回设备 （loopback device） 或"安全地" 删除一个文件。
# "ramdisk"是系统RAM内存的一段，它可以被当成是一个文件系统来操作.    
# 优点：存取速度非常快 (包括读和写).    
# 缺点: 易失性, 当计算机重启或关机时会丢失数据.    
# 会减少系统可用的RAM.    
# 那么ramdisk有什么作用呢?    
# 保存一个较大的数据集在ramdisk, 比如一张表或字典,这样可以加速数据查询, 因为在内存里查找比在磁盘里查找快得多.    
    
E_NON_ROOT_USER=70             # 必须用root来运行.    
ROOTUSER_NAME=root    
    
MOUNTPT=/mnt/ramdisk    
SIZE=2000                      # 2K 个块 (可以合适的做修改)    
BLOCKSIZE=1024                 # 每块有1K (1024 byte) 的大小    
DEVICE=/dev/ram0               # 第一个 ram 设备    
    
username=`id -nu`
if [ "$username" != "$ROOTUSER_NAME" ]    
then    
  echo "Must be root to run ""`basename $0`""."    
  exit $E_NON_ROOT_USER    
fi    
    
if [ ! -d "$MOUNTPT" ]         # 测试挂载点是否已经存在了,    
then                           #+ 如果这个脚本已经运行了好几次了就不会再建这个目录了    
  mkdir $MOUNTPT               #+ 因为前面已经建立了.    
fi    
    
dd if=/dev/zero of=$DEVICE count=$SIZE bs=$BLOCKSIZE # 把RAM设备的内容用零填充
mke2fs $DEVICE                 # 在RAM设备上创建一个ext2文件系统.    
mount $DEVICE $MOUNTPT         # 挂载设备.    
chmod 777 $MOUNTPT             # 使普通用户也可以存取这个ramdisk，但是, 只能由root来缷载它.    
    
echo """$MOUNTPT"" now available for use."    
# 现在 ramdisk 即使普通用户也可以用来存取文件了.    
# 注意, ramdisk是易失的, 所以当计算机系统重启或关机时ramdisk里的内容会消失.    
# 重启之后, 运行这个脚本再次建立起一个 ramdisk.    
# 仅重新加载 /mnt/ramdisk 而没有其他的步骤将不会正确工作.    
# 如果加以改进, 这个脚本可以放在 /etc/rc.d/rc.local，以使系统启动时能自动设立一个ramdisk。这样很合适速度要求高的数据库服务器.
exit 0 
```

## 批量重命名 和 移动

```bash
#!/bin/bash
count=1;
for img in `find . -iname "*.png" -o -iname '*.jpg'`;do
	ext=${img##*.}
	new_name="image_"$count.$ext;
	echo $new_name;
	mv $img $new_name;
	let count++;
done;
```
```bash
cky@cky-pc:~/workspace/shell/img$ ls
a.jpg  b.jpg  c.png
cky@cky-pc:~/workspace/shell/img$ ./rename.sh 
image_1.png
image_2.jpg
image_3.jpg
cky@cky-pc:~/workspace/shell/img$ ls
image_1.png  image_2.jpg  image_3.jpg  rename.sh
```