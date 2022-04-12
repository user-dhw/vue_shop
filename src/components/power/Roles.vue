<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 卡片式图 -->

      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <!-- 页面渲染  栅格系统 -->
              <el-row :class="['bdbottom', 'vcenter']" v-for="item1 in scope.row.children" :key="item1.id">
                <!-- 通过for循环嵌套渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row, item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <!-- 通过for循环嵌套渲染二级权限 -->
                  <el-row :class="['bdbottom', 'vcenter']" v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <!-- //scope.row传递对应角色数据id       item3.id传递对应角色权限id -->
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- //作用域插槽实现 -->
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleName(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleName(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-share" @click="showsetRightDialog(scope.row)">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="60%" @close="closed">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleName">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editroleName" :rules="rules" ref="editRuleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editroleName.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editroleName.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleNameInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      //控制添加角色框隐藏
      dialogVisible: false,
      //控制编辑角色框隐藏
      editDialogVisible: false,
      //控制分配权限对话框得显示与隐藏
      setRightDialogVisible: false,
      ruleForm: {
        roleName: '',
        roleDesc: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', tirgger: 'blur' },
          { min: 3, max: 10, message: "用户名的长度在3到10字符之间", tirgger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色权限', tirgger: 'blur' },
        ],
      },
      //查询到的角色信息对象
      editroleName: {},
      //修改角色信息得验证规则
      editroleNameRules: {
        roleName: [
          { required: true, message: '请输入角色名称', tirgger: 'blur' },
          { min: 3, max: 10, message: "用户名的长度在3到10字符之间", tirgger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色权限', tirgger: 'blur' },
        ],
      },
      //所有权限分配的数据
      rightList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defKeys: [],
      // 当前即将分配权限的角色
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败'); }
      this.rolesList = res.data
    },
    closed() {
      this.$refs.ruleFormRef.resetFields()
    },
    addRoleName() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.ruleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    //展示角色编辑对话框  修改角色信息
    async editRoleName(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editroleName = res.data
      this.editDialogVisible = true
    },


    //点击按钮修改角色
    editRoleNameInfo() {
      //对数据进行预校验
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) return
        //发起修改角色的信息请求
        const { data: res } = await this.$http.put('roles/' + this.editroleName.roleId, {
          roleName: this.editroleName.roleName,
          roleDesc: this.editroleName.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getRolesList()
        //提示修改成功
        this.$message.success('更新成功')
      })
    },
    //根据id删除角色
    async deleteRoleName(id) {
      // 弹窗询问是否删除数据
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      //如果用户确认删除则返回值是字符串confirm
      //如果用户取消了删除则返回值是 cancle
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除用户失败') }
      this.getRolesList()
      this.$message.success('删除成功')
    },
    //   根据id删除对应的权限
    //role接收角色得数据，rightId删除对应权限的id
    async removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功'),
        // 角色信息重新赋值权限
        role.children = res.data
    },
    // 展示分配权限对话框
    async showsetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      //    把获取到的权限是数据保存到data中
      this.rightList = res.data
      // console.log(this.rightList);

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      //弹出获取权限对话框
      this.setRightDialogVisible = true
    },
    //通过递归的形式获取角色所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前节点不包含children属性  则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        //获取所有已选中节点的id数组
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功了')
      //刷新列表
      this.getRolesList()
      //隐藏对话框
      this.setRightDialogVisible = false
    }
  },
  //  
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>