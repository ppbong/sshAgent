const tables = [
{ // 主机名称未填入时取关键字段hash值赋值
    name: 'machine',
    head: ['主机名称', '主机类型', '系统类型', '主机地址', '主机端口', '主机用户', '登录口令', '工具数量', '状态', '操作'],
    placeholder: ['hostname', 'local|remote', 'windows|linux|macos', 'ip', 'port', 'username', 'password', 'volume', 'valid|invalid', '<button class="new">new</button>']
},
{
    name: 'tool',
    head: ['主机名称', '软件名称', '软件版本', '安装路径', '程序名称', '启动参数', '状态', '操作'],
    placeholder: ['hostname|hash', 'soft', 'version', 'home', 'program', 'argument', 'valid|invalid', '<button class="new">new</button>']
},
{
    name: 'resource',
    head: ['软件名称', '软件版本', '下载地址'],
    placeholder: ['soft', 'version', 'url']
},
{
    name: 'syslog',
    head: ['时间', '类型', '等级', '事件', '内容'],
    placeholder: ['YYYY-MM-DD hh:mm:ss', 'normal|operation|transaction', 'debug|info|warn|error', 'normal|insert|update|delete|query|task|rpc', 'content']
},
{
    name: 'config',
    head: ['参数名称', '取值', '备注', '操作'],
    placeholder: ['param', 'value', 'remark', '<button class="new">new</button>']
}
]

const tableNames = []

tables.forEach(e => {
    tableNames.push(e.name)
})

const createTable = (name) => {
    var idx = tableNames.indexOf(name)

    if (idx === -1) return

    var table = tables[idx]

    var html = []
    html.push('<div class="section">')
    html.push('<table class="tb-'+ name +'">')
    html.push('<thead>')
    html.push('<tr>')
    table.head.forEach(e => {
        e === '操作' ? html.push('<th class="oper">'+ e +'</th>') : html.push('<th>'+ e +'</th>')
    })
    html.push('</tr>')
    html.push('</thead>')
    html.push('<tbody class="tb-'+ name +'-data">')
    html.push('<tr class="template">')
    table.placeholder.forEach(e => {
        html.push('<td>'+ e +'</td>')
    })
    html.push('</tr>')
    html.push('</tbody>')
    html.push('</table>')
    html.push('</div>')

    $('#container').html(html.join(''))

    createTableData(name)

    $('.template').find('button').click((event) => {
        let newline = []

        newline.push('<tr class="newline">')

        for (let i=0; i<table.head.length-1; i++) {
            newline.push('<td><input></td>')
        }
        
        newline.push('<td><button class="save">save</button><button class="delete">delete</button></td>')
        newline.push('</tr>')

        $('.template').before(newline.join(''))
    })
}

const createTableData = (name) => {
    axios.get('/' + name).then((res) => {
        if (res.err) alert('query '+ name +' error: ' + res.err)
        
        if (name === 'config') configData(res.data)
    })
}

const configData = (list) => {
    var html = []

    list.forEach(e => {
        html = []
        html.push('<tr id="'+ e.id +'" class="oldline">')
        html.push('<td><input name="param" value="'+ e.param +'"></td>')
        html.push('<td><input name="value" value="'+ e.value +'"></td>')
        html.push('<td><input name="remark" value="'+ e.remark +'"></td>')
        html.push('<td><button class="delete">delete</button></td>')
        html.push('</tr>')

        $('.template').before(html.join(''))
    })
}

$( document ).ready(()=> {
    createTable('task')
})