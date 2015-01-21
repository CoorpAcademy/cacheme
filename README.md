# Nodejs Http Cache Helper

[![Coverage Status](https://coveralls.io/repos/CoorpAcademy/cacheme/badge.svg?branch=master)](https://coveralls.io/r/CoorpAcademy/cacheme?branch=master)
[![Build Status](https://travis-ci.org/CoorpAcademy/cacheme.svg?branch=master)](https://travis-ci.org/CoorpAcademy/cacheme)

A simple but robust Http cache helper


## Installation

### Node

```
npm install cacheme --save
```

## Usage
You can simply use CacheMe as a classic middleware

```
{
    "main.strategy": {
        "priority": 1, // lower is more important
        "rules":  [
            {
                "method": "get, post, put, del",
                "path":"regex",
                "cache": {
                    override: 'public, smax-age: 40',
                    proxy: 'public',
                    unit: 'second, minute, hour, month, year',
                    duration: 60
                }

            }
        ]
    }
}
```

HttpCache can alos be use directly if you don't need to define strategy based on path

```
"cache": {
	override: 'public, smax-age: 40',
	proxy: 'public',
	unit: 'second, minute, hour, month, year',
	duration: 60
}
```


## Changelog

### 0.0.2
- fix issue on exposing middleware 
### 0.0.1 
- first commit

## Roadmap
- Add Expires headerpostMessage



## Credits

[Loïc Calvy](http://github.com/lcalvy)

## License

[The MIT License](http://opensource.org/licenses/MIT)

