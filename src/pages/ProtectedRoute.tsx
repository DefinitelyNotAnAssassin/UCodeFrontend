// ProtectedRoute.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, redirect } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  authenticated: React.ReactElement;
  unauthenticated?: React.ReactElement;  
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ authenticated, unauthenticated }) => {
    const auth = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await auth.checkAuth();
            setIsAuthenticated(isAuthenticated);
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
    return (
        <Skeleton />
    );
    }

    return isAuthenticated ? authenticated : unauthenticated;
};

export default ProtectedRoute;