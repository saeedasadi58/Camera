from rest_framework.permissions import BasePermission, SAFE_METHODS


class OwnerCanManageOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        self.message = 'you request does not have permission'
        if request.method in SAFE_METHODS:
            # Check permissions for read-only request
            return True
        elif not request.user.is_anonymous:  # it is(is_anomymous) main:admin,safe,superuser,autonticated
            return True
        else:
            # Check permissions for write request
            return False

    def has_object_permission(self, request, view, obj):
        self.message = 'you must be the owner this object'
        return obj == request.user
