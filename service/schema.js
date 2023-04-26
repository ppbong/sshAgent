// 参数配置
const config = {
    create: `CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        param TEXT UNIQUE,   /*参数*/
        value TEXT NOT NULL, /*取值*/
        remark TEXT
    )`,
    insert: `INSERT INTO config(param,value,remark) VALUES (?,?,?)`,
    update: `UPDATE config SET param=?, value=?, remark=? WHERE id=?`,
    delete: `DELETE FROM config WHERE id=?`,
    select: `SELECT * FROM config WHERE id=?`,
    selectByParam: `SELECT * FROM config WHERE param=?`,
    all: `SELECT * FROM config`,
}

const configData = [
    {param: 'product',          value: 'SSH Agent', remark: '产品名称，页面标题'},
    {param: 'version',          value: '1.0.0',     remark: '产品版本'},
    {param: 'remote_svr_ip',    value: '127.0.0.1', remark: '后台服务地址'},
    {param: 'remote_svr_port',  value: '8080',      remark: '后台服务端口'},
    {param: 'local_svr_port',   value: '3000',      remark: '本地服务端口'},
    {param: 'conn_mode',        value: 'auto',      remark: '连接模式:auto自动连接,manual手动连接'},
    {param: 'conn_retry_times', value: '6',         remark: '重试次数(次)'},
    {param: 'conn_interval',    value: '5',         remark: '连接间隔(秒)'}
]

// 主机配置
const machine = {
    create: `CREATE TABLE IF NOT EXISTS machine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL, /*主机类型local|remote*/
        os TEXT NOT NULL,   /*系统类型windows|linux|macos*/
        hostname TEXT,      /*主机名称*/
        ip TEXT,
        port INTEGER,
        username TEXT,
        password TEXT,
        volume INTEGER,     /*关联工具数量*/
        remark TEXT
    )`,
    insert: `INSERT INTO machine(type,os,hostname,ip,port,username,password,volume,remark) VALUES (?,?,?,?,?,?,?,?,?)`,
    update: `UPDATE machine SET type=?, os=?, hostname=?, ip=?, port=?, username=?, password=?, volume=? remark=? WHERE id=?`,
    delete: `DELETE FROM machine WHERE id=?`,
    select: `SELECT * FROM machine WHERE id=?`,
    all: `SELECT * FROM machine`,
    volume: `UPDATE machine SET volume=? WHERE id=?`,/*工具变更时调整*/
}

// 工具配置
const tool = {
    create: `CREATE TABLE IF NOT EXISTS tool (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine INTEGER NOT NULL, /*主机标识*/
        soft TEXT,                /*软件名称*/
        version TEXT,             /*软件版本*/
        home TEXT,                /*安装路径*/
        prog TEXT NOT NULL,       /*程序名称*/
        args TEXT,                /*启动参数*/
        remark TEXT
    )`,
    insert: `INSERT INTO tool(machine,soft,version,home,prog,args,remark) VALUES (?,?,?,?,?,?,?)`,
    update: `UPDATE tool SET machine=?, soft=?, version=?, home=?, prog=?, args=?, remark=? WHERE id=?`,
    delete: `DELETE FROM tool WHERE id=?`,
    select: `SELECT * FROM tool WHERE id=?`,
    all: `SELECT * FROM tool`,
}

// 任务管理
const task = {
    create: `CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,   /*任务编号*/
        type TEXT,            /*任务类型exec+result+datafile+logfile首字母组合*/
        soft TEXT,            /*软件名称*/
        version TEXT,         /*软件版本*/
        prog TEXT NOT NULL,   /*程序名称*/
        args TEXT,            /*执行参数*/
        data TEXT,            /*数据文件列表|分隔*/
        log TEXT,             /*日志文件列表|分隔*/
        status TEXT NOT NULL, /*任务状态running|resovled|rejected*/
        remark TEXT
    )`,
    insert: `INSERT INTO task(code,type,soft,version,prog,args,data,log,status,remark) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    update: `UPDATE task SET code=?, type=?, soft=?, version=?, prog=?, args=?, data=?, log=?, status=?, remark=? WHERE id=?`,
    delete: `DELETE FROM task WHERE id=?`,
    select: `SELECT * FROM task WHERE id=?`,
    all: `SELECT * FROM task`,
}

// 系统日志
const syslog = {
    create: `CREATE TABLE IF NOT EXISTS syslog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL, /*时间*/
        type TEXT,          /*类型normal一般|operation操作|transaction事务*/
        level TEXT,         /*等级debug|info|warn|error*/
        event TEXT,         /*事件normal|insert|update|delete|query|task|rpc*/
        content TEXT,       /*内容*/
        remark TEXT
    )`,
    insert: `INSERT INTO syslog(date,type,level,event,content,remark) VALUES (?,?,?,?,?,?)`,
    update: `UPDATE syslog SET date=?, type=?, level=?, event=?, content=?, remark=? WHERE id=?`,
    delete: `DELETE FROM syslog WHERE id=?`,
    select: `SELECT * FROM syslog WHERE id=?`,
    all: `SELECT * FROM syslog`,
}

// 下载管理
const resource = {
    create: `CREATE TABLE IF NOT EXISTS resource (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        soft TEXT,    /*软件名称*/
        version TEXT, /*软件版本*/
        url TEXT,     /*下载地址|分隔*/
        remark TEXT
    )`,
    insert: `INSERT INTO resource(soft,version,url,remark) VALUES (?,?,?,?)`,
    update: `UPDATE resource SET soft=?, version=?, url=?, remark=? WHERE id=?`,
    delete: `DELETE FROM resource WHERE id=?`,
    select: `SELECT * FROM resource WHERE id=?`,
    all: `SELECT * FROM resource`,
}

module.exports = {
    dbSchema: { config, machine, tool, task, syslog, resource },
    dbData: { configData }
}
