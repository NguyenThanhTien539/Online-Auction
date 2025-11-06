import { use } from "react"
import { useNavigate } from "react-router-dom"

export function decodeToken(token : string) : any {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch (err) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}

export async function fetchWithAuth (url: string, options: RequestInit = {}){
    const token = localStorage.getItem('accessToken');

    // Check token expiration
    if (isTokenExpired(String(token))){
        // Use refresh token to get new access token
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshUrl = "http://localhost:5000/api/client/account/refresh-token";
        if (refreshToken && !isTokenExpired(refreshToken)){
            try{
                const response = await fetch (refreshUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: refreshToken }),
                });
                const data = await response.json();
                if (data.code === 'success'){
                    localStorage.setItem('accessToken', data.accessToken);
                    
                    // Update refresh token if provided
                    if (data.refreshToken){
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }

                } else {
                    throw new Error('Unable to refresh access token');
                }
            }
            catch (error){
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Navigate to Home page
                const navigate = useNavigate();
                navigate('/');
                return;

            } 

        }
        else{
            // Refresh token is missing or expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Navigate to Home page
            const navigate = useNavigate();
            navigate('/');
            return;
        }
    }

    // Headers 
    const headers: HeadersInit = {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    };

    // Fetch to verify access token
    return fetch(url, {
        ...options,
        headers,
    });

}