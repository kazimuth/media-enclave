
def songlist_sort(request):
    if 'sort' in request.REQUEST:
        return {'sort': request.REQUEST['sort']}
    return {}
