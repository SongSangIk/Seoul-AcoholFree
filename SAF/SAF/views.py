from django.shortcuts import render, redirect, HttpResponse
from map.models import Police
from SAF.init_police import init_police


def index(request):

    if request.user.is_active:
        # Police 객체가 없을때, 초기데이터 셋업
        if len(list(Police.objects.values('id'))) == 0:
            init_police()

        return redirect('/map/')

    else:
        return redirect('/account/login')


# def createAccount(request):
#     if request.method == "GET":
#         return render(request, 'registration/register.html')
#     elif request.method == "POST":
#         code = request.POST.get('code')
#         password = request.POST.get('password')
#         name = request.POST.get('name')

#         User.objects.create_user(
#             code, "", password, first_name=name)

#         police_table = Police()
#         police_table.code = code
#         police_table.gu = request.POST.get('gu')
#         police_table.name = name
#         # name으로 경도 위도 찾아서 알아서 넣기
#         # 없으면....구의 위치를 기본값으로
#         # police_table.longitude =
#         # police_table.latitude =
#         police_table.save()
#         return redirect('')
