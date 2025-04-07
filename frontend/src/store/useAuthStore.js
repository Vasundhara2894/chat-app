import {create} from "zustand";
import {axiosInstance}  from  "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

baseURL: import.meta.env.MODE==="development"? "http://localhost:5000/api":"/";


export const useAuthStore= create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,


checkAuth:async () => {  //route authroute check this we r using 
        try {
            const res=await axiosInstance.get("/auth/check");
                console.log("Auth Check Response:", res);  // Debug full response
                console.log("Auth Check Data:", res.data); // Debug only data
                set({ authUser: res.data.user || null });
                get().connectSocket();
            
        } catch (error) {
            console.log("error in checkAuth",error);
            set({authUser:null});

            
        }finally{
            set({isCheckingAuth:false});
        }
        
    },
    signup:async(data)=>{
        set({isSigningUp:true});
        try{
           const res= await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({authUser:res.data});
            get().connectSocket();


        } catch(error){
           
            console.error("Signup Error:", error.response?.data || error.message);  // Logs error details
        toast.error(error.response?.data?.message || "Signup failed. Please try again.");


        }finally{
            set({isSigningUp:false});
        }

    },
    login: async (data) => {
        set({isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");

          get().connectSocket();
    
         
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
    
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("logged out successfully");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);

        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("profile updated successfully");
            
        } catch (error) {
            console.log("error in update profile:",error);
            toast.error(error.response.data.message);

            
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    
    connectSocket: () => {
        const { authUser } = get();
        console.log(" connectSocket called")
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
            query:{
                userId:authUser._id,
            },
            withCredentials: true,
        });
    
        console.log("Attempting socket connection..."); // ✅ Add this
    
        socket.on("connect", () => {
            console.log("Connected to server via socket:", socket.id); // ✅ Add this
        });
    
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message); // ✅ Add this
        });
    
        set({socket: socket });
        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },
    
    
}))
