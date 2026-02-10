import {jwtDecode} from "jwt-decode";

export const isTokenExpired = (): boolean=>{
    const token = localStorage.getItem("token");
    if(!token) return true;

    try{
        const decoded: any = (jwtDecode as any)(token);;
        const currenTime = Date.now()/1000;
        return decoded.exp<currenTime;


    }catch(err){
        return true;
    
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
}