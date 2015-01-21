# Nodejs Http Cache Helper
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

### 0.0.1 
- first commit


## Credits

[Loïc Calvy](http://github.com/lcalvy)

## License

[The MIT License](http://opensource.org/licenses/MIT)

