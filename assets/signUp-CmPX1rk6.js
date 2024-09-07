import{r as u,u as g,c as p,a as e,w as a,v as n,b as C,d as b,e as x,f as k,S as m,g as h,o as d,h as y}from"./index-CA9SyRrF.js";const U={id:"signUpPage",class:"bg-yellow"},_={class:"conatiner signUpPage vhContainer"},V={class:"formControls",action:"index.html"},B={key:0},P="https://todolist-api.hexschool.io",E={__name:"signUp",setup(N){const f=u(""),r=u(""),c=g(),t=u({email:"",password:"",nickname:""}),v=async()=>{if(t.value.password!==r.value)return i("密碼不相同","error");if(!t.value.email||!t.value.password||!t.value.nickname||!r.value)return i("資料不齊全","error");try{const l=await k.post(`${P}/users/sign_up`,t.value);f.value=l.data.uid,m.fire({position:"top",title:"註冊成功，導回登入頁",icon:"success",timer:1e3,toast:!0,showConfirmButton:!1,timerProgressBar:!0}),c.push({path:"/"})}catch(l){if(l.name==="AxiosError")return i("用戶已存在","error")}},i=(l,o)=>m.fire({position:"top",title:l,icon:o,timer:1e3,toast:!0,showConfirmButton:!1,timerProgressBar:!0});return(l,o)=>{const w=h("RouterLink");return d(),p("div",U,[e("div",_,[o[10]||(o[10]=e("div",{class:"side"},[e("a",{href:"#"},[e("img",{class:"logoImg",src:"https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png",alt:""})]),e("img",{class:"d-m-n",src:"https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png",alt:"workImg"})],-1)),e("div",null,[e("form",V,[o[5]||(o[5]=e("h2",{class:"formControls_txt"},"註冊帳號",-1)),o[6]||(o[6]=e("label",{class:"formControls_label",for:"email"},"Email",-1)),a(e("input",{class:"formControls_input",type:"text",id:"email",name:"email",placeholder:"請輸入 email","onUpdate:modelValue":o[0]||(o[0]=s=>t.value.email=s),required:""},null,512),[[n,t.value.email]]),o[7]||(o[7]=e("label",{class:"formControls_label",for:"name"},"您的暱稱",-1)),a(e("input",{class:"formControls_input",type:"text",name:"name",id:"name",placeholder:"請輸入您的暱稱","onUpdate:modelValue":o[1]||(o[1]=s=>t.value.nickname=s)},null,512),[[n,t.value.nickname]]),o[8]||(o[8]=e("label",{class:"formControls_label",for:"pwd"},"密碼",-1)),a(e("input",{class:"formControls_input",type:"password",name:"pwd",id:"pwd",placeholder:"請輸入密碼","onUpdate:modelValue":o[2]||(o[2]=s=>t.value.password=s),required:""},null,512),[[n,t.value.password]]),o[9]||(o[9]=e("label",{class:"formControls_label",for:"pwd"},"再次輸入密碼",-1)),a(e("input",{class:"formControls_input",type:"password",name:"pwd",id:"pwd",placeholder:"請再次輸入密碼","onUpdate:modelValue":o[3]||(o[3]=s=>r.value=s),required:""},null,512),[[n,r.value]]),t.value.password!==r.value?(d(),p("span",B,"密碼不相同")):C("",!0),e("input",{class:"formControls_btnSubmit",type:"button",value:"註冊帳號",onClick:v}),b(w,{class:"formControls_btnLink",to:"/"},{default:x(()=>o[4]||(o[4]=[y("登入")])),_:1})])])])])}}};export{E as default};
