<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="rolesDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border :stripe="true" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop': '','vcenter']" v-for="(item1,i1) in scope.row.children"
              :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row :class="[ i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                      @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delectRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" width="50%" @close="rolesDialogClose">
      <el-form :model="addRolesForm" status-icon :rules="addRolesFormRules" ref="addRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editRolesForm" status-icon :rules="addRolesFormRules" ref="editRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%" @close="setRightDialogCloes">
      <el-tree :data="rightsList" ref=treeRef :props="treeProps" show-checkbox node-key="id"
        :default-checked-keys="defKeys" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    RoleList,
    AddRoles,
    QueryRoles,
    EditRoles,
    DelectRoles,
    RemoveRight,
    GetRight,
    SetRight
  } from '@/assets/js/package.js'
  export default {
    data() {
      return {
        rolesList: [],
        rightsList: [],
        rolesDialogVisible: false,
        editDialogVisible: false,
        rightDialogVisible: false,
        addRolesForm: {
          roleName: '',
          roleDesc: ''
        },
        addRolesFormRules: {
          roleName: [{
              required: true,
              message: '请输入角色名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '长度在2-10之间',
              trigger: 'blur'
            }
          ],
          roleDesc: [{
              required: true,
              message: '请输入角色描述',
              trigger: 'blur'
            },
            {
              max: 20,
              message: '长度最大在20',
              trigger: 'blur'
            }
          ]
        },
        editRolesForm: {},
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys: [],
        roleId: ''
      };
    },
    created() {
      this.getRoles();
    },
    methods: {
      getRoles() {
        RoleList().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取角色列表失败");
          }
          this.rolesList = res.data;
        }).catch()

      },
      rolesDialogClose() {
        this.$refs.addRolesFormRef.resetFields()
      },
      addRoles() {
        this.$refs.addRolesFormRef.validate(async vali => {
          if (!vali) return

          AddRoles(this.addRolesForm.roleName, this.addRolesForm.roleDesc).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加角色失败')
            }
            this.rolesDialogVisible = false
            this.$message.success(res.meta.msg)
            this.getRoles()
          }).catch()
        })
      },
      async showEditDialog(id) {
        QueryRoles(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('查询角色失败')
          }
          this.editRolesForm = res.data
          this.editDialogVisible = true
        }).catch()

      },
      editDialogClose() {
        this.$refs.editRolesFormRef.resetFields()
      },
      editRoles() {
        this.$refs.editRolesFormRef.validate(async vali => {
          if (!vali) return

          EditRoles(this.editRolesForm.roleId, this.editRolesForm.roleName, this.editRolesForm.roleDesc).then(
            res => {
              if (res.meta.status !== 200) {
                return this.$message.error('编辑角色失败')
              }
              this.editDialogVisible = false
              this.$message.success(res.meta.msg)
              this.getRoles()
            }).catch()
        })
      },
      async delectRoles(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err
        })

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        DelectRoles(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }

          this.$message.success('删除用户成功')
          this.getRoles()
        }).catch()

      },
      async removeRightById(role, right) {
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        RemoveRight(role.id, right).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          this.$message.success(res.meta.msg)

          role.children = res.data
        }).catch()

      },
      async showSetRightDialog(role) {
        this.roleId = role.id

        GetRight().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取权限失败！')
          }
          this.rightsList = res.data
          this.getLeafKeys(role, this.defKeys)

          this.rightDialogVisible = true
        }).catch()

      },
      getLeafKeys(node, arr) {
        // 递归
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      setRightDialogCloes() {
        this.defKeys = []
      },
      async allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        const idStr = keys.join(',')

        SetRight(this.roleId, idStr).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('分配权限失败！')
          }

          this.$message.success('分配权限成功')
          this.getRoles()
          this.rightDialogVisible = false
        }).catch()

      }
    },
  };

</script>

<style>
  .el-breadcrumb {
    margin-bottom: 15px;
  }

  .el-table {
    margin-top: 15px;
  }

  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
