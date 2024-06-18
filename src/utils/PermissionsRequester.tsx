import { Permission, checkMultiple, requestMultiple } from 'react-native-permissions';

export enum PermissionsState {
    GrantedAll = 'GrantedAll',
    GrantedAny = 'GrantedAny',
    DeniedAll = 'DeniedAll',
}

export class PermissionsRequester {
    public static requestPermissions(permissions: Permission[], afterRequest: (state: PermissionsState) => void) {
        checkMultiple(permissions).then((statuses) => {
            if (Object.values(statuses).every((status) => status == 'granted')) {
                afterRequest(PermissionsState.GrantedAll)
            } else if (Object.values(statuses).some((status) => status == 'granted')) {
                afterRequest(PermissionsState.GrantedAny)
            } else {
                requestMultiple(permissions).then((rstatuses) => {
                    if (Object.values(rstatuses).every((status) => status == 'granted')) {
                        afterRequest(PermissionsState.GrantedAll)
                    } else if (Object.values(rstatuses).some((status) => status == 'granted')) {
                        afterRequest(PermissionsState.GrantedAny)
                    } else {
                        afterRequest(PermissionsState.DeniedAll)
                    }
                });
            }
        });
    }
} // class