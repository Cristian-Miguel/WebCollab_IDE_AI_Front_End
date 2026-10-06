import { useState, useEffect } from 'react';
import { type User } from '../model/user_model';
import { getUserByUuid } from '../service/user_service';
import { useAuth } from '../../auth/hook/use_auth';


export const useUser = () => {
const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicia cargando
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userUuid = authUser?.uuid;
      if (!userUuid) {
        setIsLoading(false);
        setError('Usuario no autenticado');
        return
      }

      try {
        setIsLoading(true);
        const data = await getUserByUuid(userUuid);
        setUser(data);
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error(err);
      } finally {
        // El finally se ejecuta siempre, haya éxito o error.
        // Aquí "soltamos" la vista para que se renderice.
        setIsLoading(false); 
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
};

// interface UseUserState {
//     fullUser: User | null;
//     loading: boolean;
//     error: string | null;
//     refetch: () => void; // Función para recargar datos
// }

// export const useUser = (): UseUserState => {
//     const { user: authUser, loading: authLoading } = useAuth();
//     const userUuid = authUser?.uuid;
    
//     const [fullUser, setFullUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [refetchIndex, setRefetchIndex] = useState(0);

//     const fetchUserData = useCallback(async () => {
//         if (!userUuid) return;

//         setLoading(true);
//         setError(null);
        
//         try {
//             const data = await getUserByUuid(userUuid);
//             setFullUser(data);
            
//         } catch (err: any) {
//             setError(err.message || 'Error al cargar perfil');
//         } finally {
//             setLoading(false);
//         }
//     }, [userUuid]);

//     useEffect(() => {
//         if (!authLoading) {
//             fetchUserData();
//         }
//     }, [authLoading, fetchUserData, refetchIndex]);

//     const refetch = useCallback(() => {
//         setRefetchIndex(prev => prev + 1);
//     }, []);

//     return { fullUser, loading, error, refetch };
// };
