# goto

- 每一步的错误处理需要把之前申请或注册成功的资源全部都释放掉,比如 class_create 失败需要注销irq和驱动(因为它们已经成功了,到这一步失败了,那么之前的成功就没有意义了,所以因为一切要恢复到最初的样子),所以这会产生大量重复的代码,free_irq这个函数写了三次,unregister_chrdev写了二次

- c 的 goto 跳转只能存在于函数内部，是一种局部跳转

```c
retval = request_irq(IRQ_EINT(20), buttons_interrupt, IRQF_DISABLED,
     "KEY1", (void *)EINT_DEVICE_ID);
if(retval){
    return error;
}
major = register_chrdev(major, DRIVER_NAME, &key_fops);
if(major < 0){
    free_irq(IRQ_EINT(20), (void *)EINT_DEVICE_ID); // 写第一次
    retval = major;
    return retval;
}
key_class=class_create(THIS_MODULE,DRIVER_NAME);
if(IS_ERR(key_class)){
    free_irq(IRQ_EINT(20), (void *)EINT_DEVICE_ID); // 写第二次
    unregister_chrdev(major, DRIVER_NAME);
    retval =  PTR_ERR(key_class);
    return retval;
}
key_device=device_create(key_class,NULL, MKDEV(major, minor), NULL,DRIVER_NAME);
if(IS_ERR(key_device)){
    free_irq(IRQ_EINT(20), (void *)EINT_DEVICE_ID); // 写第三次
    unregister_chrdev(major, DRIVER_NAME);
    class_destroy(key_class);
    retval = PTR_ERR(key_device);
    return error_device;
}

// 使用 goto 后的代码
retval = request_irq(IRQ_EINT(20), buttons_interrupt, IRQF_DISABLED,"KEY1",(void *)EINT_DEVICE_ID);
if(retval)
    goto error;

major = register_chrdev(major, DRIVER_NAME, &key_fops);
if(major < 0){
    retval = major;
    goto error_register;
}
key_class=class_create(THIS_MODULE,DRIVER_NAME);
if(IS_ERR(key_class)){
    retval =  PTR_ERR(key_class);
    goto error_class;
}
key_device=device_create(key_class,NULL, MKDEV(major, minor), NULL,DRIVER_NAME);
if(IS_ERR(key_device)){
    retval = PTR_ERR(key_device);
    goto error_device;
}
return 0;

error_device:
    class_destroy(key_class);
error_class:
    unregister_chrdev(major, DRIVER_NAME);
error_register:
    free_irq(IRQ_EINT(20), (void *)EINT_DEVICE_ID);
error:
    return retval;
}
```

