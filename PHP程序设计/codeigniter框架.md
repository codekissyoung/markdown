##查阅链接 ##
http://www.codeigniter.com　官方文档
http://www.cnblogs.com/zhenyu-whu/p/3159856.html　一步一步重写CI框架博客

## 使用CI的步骤参考 ##
 - 结合apache的 rewrite 模块和 .htaccess 文件隐藏入口index.php
 - 配置数据库：config/database.php
 - 配置自动加载：helper ，library ，model　:  config/autoload.php
```
 $autoload['libraries'] = array('database'); //自动加载数据库
 $autoload['helper'] = array('url','file'); //自动加载辅助函数
```
 - 配置 session 加密key
 - 拓展控制器：application/config/config.php
```
 $config['subclass_prefix'] = 'DDS_';
```
新建拓展控制器文件　application/core/DDS_controller.php
```
class DDS_controller extends CI_Controller(){
       public function __construct(){
			parent::__construct();
		}
}
```
 - 配置默认控制器路由：application/config/routes.php 
```
 $route['default_controller'] = 'Blog'；
```
 - ​规划好url ,一个url对应一个控制器
            example.com/products/shoes/show/123 对应
            application/controllers/products/shoes.php   ,show 是控制器的方法，123是传给方法的参数
 - 拓展辅助函数helper
	  application/helpers文件夹中，增加display_helper.php（文件名必须加上 _helper)
```
$this->load->helper('display');//加载辅助函数
mainpage();//调用：辅助函数就是一系列函数，是过程式，不是 oo
```
 - ​自定义类库
		自定义类是独立的类，不会自动地包含在CI超级对象中，因此你必须用不同的方法来调用，详见第七章。对于自定义类来说，$this意味着自定义类对象本身，而不是超级对象.但是我们仍然可以在自定义类里使用超级对象．如下：
```
$obj =& get_instance(); //在新类里面取得 CI的超级对象
$obj->config->item('base_url');//现在你能像调用CI超级对象一样地调用它,访问超级对象的资源了（类，方法，属性，以及配置之类的）
```
 - 写好模型model
 - 组织好视图view
 - 在控制器里组织好model和view进行输出．
 - 对于 ajax 请求，只需返回 json 就可，不用加载视图的！
```
header('content-type:application/json;charset=utf8');
echo json_encode($data);
exit();
```
## ​ＣＩ操作数据库 ##

```
通杀 sql 查询
$query = $this->db->query("要执行的 SQL");
if ($query->num_rows() > 0)  //判断是否返回结果集{
      return $query->result_array();   //返回结果集
}
$query->free_result() ；//释放结果集
$this->db->insert_id() ；//这个ID号是执行数据插入时的ID。
$this->db->affected_rows()；//当执行写入操作（insert,update等）的查询后，显示被影响的行数。
查询数据
$this->db->get('tabel_name');//查询整张表的数据
$this->db->get('mytable', 10, 20); //返回 20-29 条记录
$this->db->select('title, content, date')->get('mytable');//查询某几个字段
连贯查询
$this->db->select('id,name')->from('user')->where(array('name'=>'merry','id >'=>2))->limit(3,2)->order_by('id desc')->get();//从第2条后开始，取出3条数据
插入数据
$this->db->insert('table_name',$assoc_array);
更新数据
$this->db->update('table_name',$assoc_array,$condition_array);
删除数据
$this->db->delete('table_name',$condition_array);
```
## 在控制器里常用代码 ##
```
/*$this是超级对象，也就是控制器对象，在 view ，controller，和 model 都是一样的！*/

<?php
class Page extends CI_Controller {
   function index()
   {
	 //这句话放开头，能将本函数里运行的sql语句都列出来
	 $this->output->enable_profiler(true);
    /*加载数据库*/
	$this->load->database();/*这句把数据库对象，赋值给 ci 超级对象的 db 属性*/
	$res=$this->db->query($sql); // return  ci_result
	/*载入模型*/
	$this->load->model('Model_name'); //载入模型
	$this->load->model('blog/queries');//载入文件夹中模型
	$this->Model_name->function();// 使用模型里面的函数
	$this->load->model('Model_name', 'fubar');
	$this->fubar->function();  //使用别名 的方式使用 model 里面的函数
	/*加载类库*/
	$this->load->library(array('email', 'table'));
	/*加载辅助函数*/
	$this->load->helper(array('url','pager'));
	/*读取配置文件config.php 的内容*/
	$this->config->item('base_url');
	$this->config->item('css');
	/*input 对象*/
	$this->input->post('username'); //等价于 $_POST['username'];
	$this->input->server('DOCUMENT_ROOT');//$_SERVER['DOCUMENT_ROOT'];
	/*session类*/
	$this->load->library('session');/*加载 session 类*/
	$newdata = array(
                   'username'  => 'johndoe',
                   'email'     => 'johndoe@some-site.com',
                   'logged_in' => TRUE
               );
	$this->session->set_userdata($newdata);//设置自己的session 数据
	$this->session->userdata('username');  //取回自己的session数据
	$array_items = array('username' => '', 'email' => '');
	$this->session->unset_userdata($array_items); //删除session 里面的数据，通过数组
	$this->session->sess_destroy(); // 清除session 
	/*创建url*/
	site_url ('welcome/index')；
	base_url ('控制器/方法')；//创建以网站  '网站域名/控制器/方法' 格式的url，如www.dadishe.com/welcome/index
	/*载入视图*/
    $this->load->view('header',$data);//载入多个视图，它们会被合并到一起，只需在第一个视图，添加数据
    $this->load->view('menu');
    $this->load->view('content');
    $this->load->view('footer');
    $this->load->view('folder_name/file_name');/*加载文件夹中的view*/
    //$string = $this->load->view('myfile', $data, true);
    //将 生成的页面 生成字符串，而不是输出到浏览器,这个可以用于做页面网站静态化
}

```












