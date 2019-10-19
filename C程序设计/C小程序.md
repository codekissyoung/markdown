# C小程序

记录了我写的一些C小程序。

## 求某一年的某一月有多少天

```c
#include <stdio.h>
int days[] = {31,28,31,30,31,30,31,31,30,31,30,31};

int main( int argc, char *argv[] )
{
	int year, month;
	int ret = scanf( "%d %d", &year, &month );

	int day = days[month - 1];

	if( year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ) 
	{
		if( month == 2 )
			day++;			// 闰年二月多1天
	}

	printf("%d\n", day);

	return 0;
}
```