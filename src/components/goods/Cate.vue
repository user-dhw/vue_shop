<template>
  <div>
         <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!--表格 -->
        <tree-table class="treeTable" :data='cateList' :columns='columns'
         :selection-type="false" :expand-type="false" show-index index-text="#" border>
         <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
                <div>
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </div>
            </template>
            <!-- 排序模板 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作模板 -->
            <template slot="opt" slot-scope="scope">
                <div>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </div>
            </template>
            
        </tree-table>
        <!-- 分页区 -->
         <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="querInfo.pagenum"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="querInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">    
    </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCtaeClosed'>
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
             <el-form-item label="父级分类">
                 <!-- Cascader 级联选择器 -->
                 <!-- options用来指定数据源 -->
                 <!-- props用来指定配置对象 -->
                <el-cascader expandTrigger='hover' clearable change-on-select v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
            <el-form
                    :model="addCateForm"
                    :rules="addCateFormRules"
                    ref="editCateFormRef"
                    label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
        </el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5,
            },
            //商品分类的数据列表，默认空
            cateList:[],
            //总数据条数
            total:0,
            //为table指定列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name',
            },
            {
                label:'是否有效',
                //将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板名称
                template:'isOk'
            },
             {
                label:'排序',
                //将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板名称
                template:'order'
            },
            {
                label:'操作',
                //将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板名称
                template:'opt'
            }
            ],
            //控制添加分类对话框显示与隐藏
            addCateDialogVisible:false,
            //添加分类的数据表单对象
            addCateForm:{
                //将要添加分类的名称
                cat_name:"",
                // 父级分类的id
                cat_pid:0,
                // 分类等级 默认分类等级为0
                cat_level:0
            },
            // 添加分类的表单的验证规则对象
            addCateFormRules:{
                // 添加的规则
                cat_name:[
                    {required:true,message:"请输入分类的名称",trigger:'blur'}
                ]
            },
            // 父级分类的列表
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            // 选中的父级分类的id数组
            selectedKeys:[],

            //编辑框显示与隐藏
            editCateDialogVisible:false,
             editCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'}
                    ]
                },
                // 编辑表单 绑定对象
                editCateForm: ''

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取商品分类数据
       async getCateList(){
          const {data:res}=await this.$http.get('categories',{params:this.querInfo})
          if(res.meta.status!==200){
              return this.$message.error('获取商品分类失败')
          }
          //把数据列表赋值给catelist
          this.cateList=res.data.result
          //为总数据条数赋值
          this.total=res.data.total         
        },
        //监听pagesize改变事件
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize
            // 刷新页面 重新获取
            this.getCateList()   
        },
        //监听pagenum改变事件
        handleCurrentChange(newPage){
            this.querInfo.pagenum=newPage
            // 刷新页面 重新获取
            this.getCateList()  
        },
        //点击按钮  展示添加按钮对话框
        showAddCateDialog(){
            //先获取父级分类的数据列表在展示对话框
            this.getParentCateList()
            this.addCateDialogVisible=true
        },
        // 获取父级分类的数据列表
       async getParentCateList(){
          const{data:res}=await this.$http.get('categories',{
                params:{type:2} })
           if(res.meta.status!==200){
               return this.$message.error('获取父级分类数据失败')
           }
           this.parentCateList=res.data
        },
        // 选择项发生变化触发这个函数
        parentCateChange(){
            // 如果selectedKeys数组中lenght大于0，证明选总父级分类反之没选择
            if(this.selectedKeys.length>0){
                // 父级分类的id
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
                //为当前分类的等级赋值
                this.addCateForm.cat_level=this.selectedKeys.length
                return
            }else{
                // 父级分类的id
                 this.addCateForm.cat_pid=0
                //为当前分类的等级赋值
                this.addCateForm.cat_level=0
            }
        },
        // 点击按钮添加新的分类
        addCate(){
           this.$refs.addCateFormRef.validate(async valid=>{
               if(!valid)return 
             const {data:res} = await this.$http.post('categories',this.addCateForm)
             if(res.meta.status!==201){
                 return this.$message.error('添加分类失败')
             }
             this.$message.success('添加分类成功')
            //  刷新列表
             this.getCateList()
            //  隐藏对话框
             this.addCateDialogVisible=false
           })
        },
        //监听对话框的关闭事件 重置表单数据
        addCtaeClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys=[]
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        },
        //根据id删除该分类
       async deleteCate(cat_id){
            const result= await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err=>{
            return err
        })
        // console.log(result);
        if(result!=='confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:res}= await this.$http.delete('categories/'+cat_id)
        if(res.meta.status!==200){
            return this.$message.error('删除分类失败')
        }
        this.$message.success('删除成功')
        this.getCateList()
        this.addCateDialogVisible=false
        },
         // 显示编辑对话框
            async showEditCateDialog(id) {
                const {data: res} = await this.$http.get('categories/' + id)
                if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
                this.editCateForm = res.data
                this.editCateDialogVisible = true
            },
            // 编辑分类名
            editCate() {
                this.$refs.editCateFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id,
                        {
                            cat_name: this.addCateForm.cat_name
                        })
                    if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
                    this.$message.success('更新分类名成功！')
                    this.getCateList()
                    this.editCateDialogVisible = false
                })
            }

    },
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}

</style>