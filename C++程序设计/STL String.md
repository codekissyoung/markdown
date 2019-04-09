# C 风格的字符串

- 就是一个以 '\0' 字符结尾的字符数组
- string 类型 转换成 c 字符串

```c++
string name = "codekissyoung";
printf("name : %s\n", name.c_str());
```

```c++
string 支持完全随机访问
s.substr(i,j); 截取 [i,j)范围内的字符串
getline(is,s); 从 is 中读入一行，存储在 s 中
s += s2; 连接字符串
```
