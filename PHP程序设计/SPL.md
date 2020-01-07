# 双向链表

SplDoublyLinkedList类
当前节点操作：rewind(移动到bottom节点) current(获取当前节点) next()下一个节点 prev()前一个节点 valid()判断当前节点是否是有效节点
增加节点操作：push(添加到后面),unshift(添加到前面)
删除操作：pop(删后面),shift(删前面)
定位操作：bottom(到最开始的节点),top(到最后面的节点)
特定节点操作：offsetExists,offsetGet,offsetSet,offsetUnset

# 堆栈：先入后出
```
$stack = new SplStack();
$stack->push('数据1');
$stack->push('数据2');
echo $stack->pop(); //数据2
echo $stack->pop(); //数据1
```
# 队列：先入先出
```
$queue = new SplQueue();
$queue->enqueue("数据1");
$queue->enqueue("数据2");
$queue->dequeue();  //数据1
$queue->dequeue();  //数据2
```
# 堆
```
$heap = new SplMinHeap();
$heap->insert('数据1');
$heap->insert('数据2');
echo $heap->extract();
echo $heap->extract();
```
# 固定尺寸的数组
```
$array = new SplFixedArray(10);
$array[0] = 123;
$array[0] = 342;
```

# 迭代器 Iterator 接口
current() 当前节点 key() next() prev()
ArrayIterator 迭代器用于遍历数组


#降序堆

#升序堆

#优先级队列


#定长数组


#对象容器
