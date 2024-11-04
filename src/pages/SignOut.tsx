import { useAuth } from "@/contexts/AuthContext";


export default function SignOut() {  

    const auth = useAuth(); 
    auth.logout(); 
    window.location.href = '/';

    return <> </>

} 