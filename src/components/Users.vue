<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" :span="6" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <el-dialog title="添加用户信息" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editList" status-icon :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editList.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editList.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editList.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="setRoledialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{ userInfo.username }}</p>
        <p>当前的角色: {{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    UsersList,
    UserState,
    AddUser,
    QueryUser,
    EditUser,
    DeleteUser,
    GetRole,
    SetRole
  } from '@/assets/js/package.js'
  export default {
    data() {
      // 验证邮箱规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb();
        }
        cb(new Error("请输入合法的邮箱"));
      };

      // 验证手机规则
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile =
          /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regMobile.test(value)) {
          return cb();
        }
        cb(new Error("请输入合法的手机号"));
      };

      return {
        queryInfo: {
          query: "",
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 10,
        },
        userList: [],
        total: 0,
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          username: "",
          password: "",
          email: "",
          mobile: "",
        },
        addFormRules: {
          username: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            {
              min: 2,
              max: 10,
              message: "长度在2-10之间",
              trigger: "blur"
            },
          ],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 3,
              max: 15,
              message: "长度在3-15之间",
              trigger: "blur"
            },
          ],
          email: [{
              required: true,
              message: "请输入邮箱",
              trigger: "blur"
            },
            {
              validator: checkEmail,
              trigger: "blur"
            },
          ],
          mobile: [{
              required: true,
              message: "请输入手机号",
              trigger: "blur"
            },
            {
              validator: checkMobile,
              trigger: "blur"
            },
          ],
        },
        editList: {},
        setRoledialogVisible: false,
        userInfo: {},
        rolesList: [],
        selectedRoleId: ''
      };
    },
    created() {
      this.getUserList();
    },
    methods: {
      getUserList() {
        UsersList(this.queryInfo).then(res => {
          if (res.meta.status !== 200)
            return this.$message.error("获取用户列表失败！");
          this.userList = res.data.users;
          this.total = res.data.total;
        }).catch(err => {

        })

      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      userStateChanged(userinfo) {
        UserState(userinfo.id, userinfo.mg_state).then(res => {
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新用户状态失败！");
          }
        }).catch(err => {})
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      addUser() {
        this.$refs.addFormRef.validate(vali => {
          if (!vali) return;
          // 可以发起添加用户请求
          AddUser(this.addForm).then(res => {
            if (res.meta.status !== 201) {
              this.$message.error("用户添加失败");
            }
            this.dialogVisible = false;
            this.$message.success(res.meta.msg);
            this.getUserList();
          }).catch(err => {})
        });
      },
      // 展示编辑用户弹框
      showEditDialog(id) {
        QueryUser(id).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error("查询用户信息失败");
          }
          this.editList = res.data;
          this.editDialogVisible = true;
        }).catch(err => {})

      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      editUser() {
        this.$refs.editFormRef.validate(vali => {
          if (!vali) return;
          EditUser(this.editList.id, this.editList.email, this.editList.mobile).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error("提交失败");
            }
            this.editDialogVisible = false;
            this.getUserList();
            this.$message.success(res.meta.msg);
          }).catch(err => {})
        });
      },
      async deleteUser(id) {
        const confirmResult = await this.$confirm(
          "此操作将永久删除该用户, 是否继续?",
          "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => {
          return err;
        });

        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除");
        }

        DeleteUser(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message.success(res.meta.msg);
          this.getUserList();
        }).catch(err => {})

      },
      showSetRoleDialog(userInfo) {
        this.userInfo = userInfo;
        GetRole().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取角色失败！");
          }
          this.rolesList = res.data;
          this.setRoledialogVisible = true;
        }).catch()
      },
      setRole() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }
        SetRole(this.userInfo.id,this.selectedRoleId).then(res=>{
          if (res.meta.status !== 200) {
          return this.$message.error('分配角色失败！')
        }
        this.$message.success(res.meta.msg)
        this.getUserList();
        this.setRoledialogVisible = false
        }).catch()
        
      },
      setRoleDialogClosed() {
        this.selectedRoleId = ''
        this.userInfo = ''
      }
    },
  };

</script>

<style>
  .el-breadcrumb {
    margin-bottom: 15px;
  }

  .el-table {
    margin: 15px 0;
    font-size: 12px;
  }

</style>
