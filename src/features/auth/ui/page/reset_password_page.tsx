import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import ForgotPasswordForm from '../components/forgot_password_form';
import ResetPasswordChangeForm from '../components/reset_password_change_form';
import { validateResetToken } from '../../../../core/config/jwt_manage';
import TokenStatusMessage from '../components/token_status_message';

const ResetPasswordPage: React.FC = () => {
    const { token: pathToken } = useParams<{ token: string }>();
    
    const [searchParams] = useSearchParams();
    const queryToken = searchParams.get('token');

    const finalToken = pathToken || queryToken;

    // 1. Si NO hay token, mostrar el formulario de solicitud
    if (!finalToken) {
        return <ForgotPasswordForm />;
    }

    // 2. Si SÍ hay token, validar su formato y expiración
    const tokenStatus = validateResetToken(finalToken);
    
    // 3. Decidir qué componente renderizar basado en el estado
    if (tokenStatus === 'valid') {
        // Token con formato correcto y no expirado
        return <ResetPasswordChangeForm token={finalToken} />;
    }

    // 4. Si el token es inválido o expirado, mostrar el mensaje de error visual
    if (tokenStatus === 'expired' || tokenStatus === 'invalid_format') {
        return <TokenStatusMessage status={tokenStatus} />;
    }

    // 5. Fallback por si acaso
    return <ForgotPasswordForm />;
    
};

export default ResetPasswordPage;