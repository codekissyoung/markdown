# C零碎的一些知识




对齐处理（Alignment）的标准化（包括_Alignas标志符，alignof运算符，aligned_alloc函数以及<stdalign.h>头文件）。

_Noreturn 函数标记，类似于 gcc 的 __attribute__((noreturn))。

_Generic 关键字。

多线程（Multithreading）支持，包括：
_Thread_local存储类型标识符，<threads.h>头文件，里面包含了线程的创建和管理函数。
_Atomic类型修饰符和<stdatomic.h>头文件。

增强的Unicode的支持。基于C Unicode技术报告ISO/IEC TR 19769:2004，增强了对Unicode的支持。包括为UTF-16/UTF-32编码增加了char16_t和char32_t数据类型，提供了包含unicode字符串转换函数的头文件<uchar.h>。

删除了 gets() 函数，使用一个新的更安全的函数gets_s()替代。

增加了边界检查函数接口，定义了新的安全的函数，例如 fopen_s()，strcat_s() 等等。

增加了更多浮点处理宏(宏)。

匿名结构体/联合体支持。这个在gcc早已存在，C11将其引入标准。

静态断言（Static assertions），_Static_assert()，在解释 #if 和 #error 之后被处理。

新的 fopen() 模式，("…x")。类似 POSIX 中的 O_CREAT|O_EXCL，在文件锁中比较常用。

新增 quick_exit() 函数作为第三种终止程序的方式。当 exit()失败时可以做最少的清理工作。