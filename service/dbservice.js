const sqlite3 = require('sqlite3')
const { accessSync, constants } = require('fs')
const path = require('path')
const { dbSchema, dbData } = require('./schema')

const dbfile = path.resolve(__dirname, './agent.sqlite')

const initialized = function (dbfile) {
	try {
		accessSync(dbfile, constants.R_OK | constants.W_OK); // F_OK
		return true;
	} catch(err) {
		return false;
	}
}(dbfile)

const db = new sqlite3.Database(dbfile)

const initializing = function() {
	if(initialized) return

	db.serialize(()=>{
		db.run(dbSchema.config.create)
		db.run(dbSchema.machine.create)
		db.run(dbSchema.tool.create)
		db.run(dbSchema.task.create)
		db.run(dbSchema.syslog.create)
		db.run(dbSchema.resource.create)

		stmt = db.prepare(dbSchema.config.insert)

		for (let i=0; i<dbData.configData.length; i++) {
			let e = dbData.configData[i]
			stmt.run(e.param, e.value, e.remark)
		}

		stmt.finalize()
	})
}()

const tables = ['config', 'machine', 'tool', 'task', 'syslog', 'resource']

const _select = (table, id, callback) => {
	if (tables.indexOf(table) === -1) return

	const sql = 'SELECT * FROM ' + table + ' WHERE id=?'

	db.get(sql, id, (err, row) => {
		if (err) throw err

		callback(row)
	})
}

const _select_all = (table, callback) => {
	if (tables.indexOf(table) === -1) return

	const sql = 'SELECT * FROM ' + table

	db.all(sql, (err, rows) => {
		if (err) throw err

		callback(rows)
	})
}

const _delete = (table, id, callback) => {
	if (tables.indexOf(table) === -1) return

	const sql = 'DELETE FROM ' + table + ' WHERE id=?'

	db.serialize(() => {
		stmt = db.prepare(sql)
		stmt.run(id)
		stmt.finalize()

		if (callback !== undefined) callback()
	})
}

const _delete_all = (table, callback) => {
	if (tables.indexOf(table) === -1) return

	const sql = 'DELETE FROM ' + table

	db.run(sql, (err) => {
		if (err) throw err

		if (callback !== undefined) callback()
	})
}

module.exports = {
	dbservice: {
	// 参数
	insertConfig: (param, value, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.config.insert)
			stmt.run(param, value, remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateConfig: (id, param, value, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.config.update)
			stmt.run(param, value, remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteConfig: (id, callback) => {
		_delete('config', id, callback)
	},

	deleteConfigAll: (callback) => {
		_delete_all('config', callback)
	},

	selectConfig: (id, callback) => {
		_select('config', id, callback)
	},

	selectConfigAll: (callback) => {
		_select_all('config', callback)
	},

	selectByParam: (param, callback) => {
		db.get(dbSchema.config.selectByParam, param, (err, row) => {
			if (err) throw err
	
			callback(row)
		})
	},

	// 主机
	insertMachine: (type, os, hostname, ip, port, username, password, volume, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.machine.insert)
			stmt.run(type, os, hostname, ip, port, username, password, volume, remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateMachine: (id, type, os, hostname, ip, port, username, password, volume, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.machine.update)
			stmt.run(type, os, hostname, ip, port, username, password, volume, remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateMachineVolume: (id, volume, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.machine.volume)
			stmt.run(volume, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteMachine: (id, callback) => {
		_delete('machine', id, callback)
	},

	deleteMachineAll: (callback) => {
		_delete_all('machine', callback)
	},

	selectMachine: (id, callback) => {
		_select('machine', id, callback)
	},

	selectMachineAll: (callback) => {
		_select_all('machine', callback)
	},

	// 工具软件
	insertTool: (machine, soft, version, home, prog, args, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.tool.insert)
			stmt.run(machine, soft, version, home, prog, args, remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateTool: (id, machine, soft, version, home, prog, args, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.tool.update)
			stmt.run(machine, soft, version, home, prog, args, remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteTool: (id, callback) => {
		_delete('tool', id, callback)
	},

	deleteToolAll: (callback) => {
		_delete_all('tool', callback)
	},

	selectTool: (id, callback) => {
		_select('tool', id, callback)
	},

	selectToolAll: (callback) => {
		_select_all('tool', callback)
	},

	// 任务管理
	insertTask: (code, type, soft, version, prog, args, data, log, status, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.task.insert)
			stmt.run(code, type, soft, version, prog, args, data, log, status, remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateTask: (id, code, type, soft, version, prog, args, data, log, status, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.task.update)
			stmt.run(code, type, soft, version, prog, args, data, log, status, remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteTask: (id, callback) => {
		_delete('task', id, callback)
	},

	deleteTaskAll: (callback) => {
		_delete_all('task', callback)
	},

	selectTask: (id, callback) => {
		_select('task', id, callback)
	},

	selectTaskAll: (callback) => {
		_select_all('task', callback)
	},

	// 系统日志
	insertSyslog: (date, type, level, event, content, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.syslog.insert)
			stmt.run(date, type, level, event, content, remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateSyslog: (id, date, type, level, event, content, remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.syslog.update)
			stmt.run(date, type, level, event, content, remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteSyslog: (id, callback) => {
		_delete('syslog', id, callback)
	},

	deleteSyslogAll: (callback) => {
		_delete_all('syslog', callback)
	},

	selectSyslog: (id, callback) => {
		_select('syslog', id, callback)
	},

	selectSyslogAll: (callback) => {
		_select_all('syslog', callback)
	},

	// 下载资源
	insertResource: (soft,version,url,remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.resource.insert)
			stmt.run(soft,version,url,remark, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	updateResource: (id, soft,version,url,remark, callback) => {
		db.serialize(() => {
			stmt = db.prepare(dbSchema.resource.update)
			stmt.run(soft,version,url,remark, id, (err) => {
				if (err) throw err
			})
			stmt.finalize()

			if (callback !== undefined) callback()
		})
	},

	deleteResource: (id, callback) => {
		_delete('resource', id, callback)
	},

	deleteResourceAll: (callback) => {
		_delete_all('resource', callback)
	},

	selectResource: (id, callback) => {
		_select('resource', id, callback)
	},

	selectResouceAll: (callback) => {
		_select_all('resource', callback)
	},

	release: () => {
		if (db) {
			db.close()
		}
	}
}
}