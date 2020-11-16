# APP MAIN
from web import create_app

app = create_app()
# print()
if __name__ == '__main__':
    dbg = True if app.config['DEBUG'] else False
    # hst = True if app.config['HOST_URL'] else False
    app.run(host='127.0.0.1', debug=dbg)
    # app.run()
