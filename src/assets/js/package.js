// 导入axios
import axios from 'axios'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 自定义新建一个axios实例
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
})

// axios的拦截器
// 请求拦截
instance.interceptors.request.use(config => {
  // 获取 sessionStorage 保存的 token 值
  const res = window.sessionStorage.getItem('token')
  // 设置 Authorization 的 token值
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
// 响应拦截
instance.interceptors.response.use(res => {
  return res.data
})

// 把axios 挂载到vue的$http原型上
// Vue.prototype.$http = axios


// 登录接口验证
export const LoginIn = params => {
  return instance.post('login', params)
}

// 左侧菜单权限接口
export const MenusList = () => {
  return instance.get("menus");
}


// 获取角色列表
export const UsersList = params => {
  return instance.get("users", {
    params: params,
  });
}

// 角色状态接口
export const UserState = (uid,type) => {
  return instance.put(
    `users/${uid}/state/${type}`
  );
}

// 添加用户
export const AddUser = params => {
  return instance.post("users", params);
}

// 查询用户
export const QueryUser = params => {
  return instance.get(`users/${params}`);
}


// 编辑用户提交
export const EditUser = (id,email,mobile) => {
  return instance.put(
    "users/" + id, {
      email: email,
      mobile: mobile 
    }
  );
}

// 删除用户
export const DeleteUser = id => {
  return instance.delete("users/" + id);
}

// 获取角色
export const GetRole = () => {
  return instance.get("roles");
}

// 分配角色
export const SetRole = (id,rid) => {
  return instance.put(`users/${id}/role`, {
    rid: rid
  })
}


// 获取角色列表
export const RoleList = () => {
  return instance.get("roles");
}







// 获取权限列表
export const RightsList = () => {
  return instance.get("rights/list");
}


// 添加角色
export const AddRoles = (roleName,roleDesc) => {
  return instance.post('roles', {
    roleName: roleName,
    roleDesc: roleDesc
  })
}


// 查询角色
export const QueryRoles = id => {
  return instance.get('roles/' + id)
}


// 编辑角色
export const EditRoles = (roleId,roleName,roleDesc) => {
  return instance.put('roles/' + roleId, {
    roleName: roleName,
    roleDesc: roleDesc
  })
}


// 删除角色
export const DelectRoles = id => {
  return instance.delete('roles/' + id)
}


// 删除权限
export const RemoveRight = (id,right) =>{
  return instance.delete(`roles/${id}/rights/${right}`)
}


// 获取权限
export const GetRight = () => {
  return instance.get('rights/tree')
}


// 分配权限
export const SetRight = (roleId,idStr) => {
  return instance.post(`roles/${roleId}/rights`, {
    rids: idStr
  })
}

