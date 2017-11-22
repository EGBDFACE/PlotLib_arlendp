//
//  DFIColor.m
//  DFI
//
//  Created by vanney on 2017/5/5.
//  Copyright © 2017年 vanney9. All rights reserved.
//

// TODO - 先处理rgb #f00 和 #ff0000 的情况

#import "DFIColor.h"

static const NSString *kI = @"\\s*([+-]?\\d+)\\s*";
static const NSString *kN = @"\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
static const NSString *kP = @"\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
static const NSString *kHex3 = @"^#([0-9a-f]{3})$";
static const NSString *kHex6 = @"^#([0-9a-f]{6})$";

static NSRegularExpression *kReHex3 = nil;
static NSRegularExpression *kReHex6 = nil;
static NSRegularExpression *kReRgbInteger = nil;
static NSRegularExpression *kReRgbPercent = nil;
static NSRegularExpression *kReRgbaInteger = nil;
static NSRegularExpression *kReRgbaPercent = nil;
static NSRegularExpression *kReHslPercent = nil;
static NSRegularExpression *kReHslaPercent = nil;
static NSDictionary *kNamed = nil;

@implementation DFIColor

- (instancetype)initWithR:(CGFloat)r g:(CGFloat)g b:(CGFloat)b andOpacity:(CGFloat)opacity {
    if (self = [super init]) {
        _r = r;
        _g = g;
        _b = b;
        _opacity = opacity;
    }

    return self;
}

- (instancetype)init {
    if (self = [super init]) {
        static dispatch_once_t token;
        dispatch_once(&token, ^{
            kReHex3 = [[NSRegularExpression alloc] initWithPattern:kHex3 options:0 error:nil];
            kReHex6 = [[NSRegularExpression alloc] initWithPattern:kHex6 options:0 error:nil];
            kReRgbInteger = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^rgb\\(%@,%@,%@\\)$", kI, kI, kI] options:0 error:nil];
            kReRgbPercent = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^rgb\\(%@,%@,%@\\)$", kP, kP, kP] options:0 error:nil];
            kReRgbaInteger = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^rgba\\(%@,%@,%@,%@\\)$", kI, kI, kI, kN] options:0 error:nil];
            kReRgbaPercent = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^rgba\\(%@,%@,%@,%@\\)$", kP, kP, kP, kN] options:0 error:nil];
            kReHslPercent = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^hsl\\(%@,%@,%@\\)$", kN, kP, kP] options:0 error:nil];
            kReHslaPercent = [[NSRegularExpression alloc] initWithPattern:[NSString stringWithFormat:@"^hsla\\(%@,%@,%@,%@\\)$", kN, kP, kP, kN] options:0 error:nil];
            kNamed = @{
                    @"aliceblue": @(0xf0f8ff),
                    @"antiquewhite": @(0xfaebd7),
                    @"aqua": @(0x00ffff),
                    @"aquamarine": @(0x7fffd4),
                    @"azure": @(0xf0ffff),
                    @"beige": @(0xf5f5dc),
                    @"bisque": @(0xffe4c4),
                    @"black": @(0x000000),
                    @"blanchedalmond": @(0xffebcd),
                    @"blue": @(0x0000ff),
                    @"blueviolet": @(0x8a2be2),
                    @"brown": @(0xa52a2a),
                    @"burlywood": @(0xdeb887),
                    @"cadetblue": @(0x5f9ea0),
                    @"chartreuse": @(0x7fff00),
                    @"chocolate": @(0xd2691e),
                    @"coral": @(0xff7f50),
                    @"cornflowerblue": @(0x6495ed),
                    @"cornsilk": @(0xfff8dc),
                    @"crimson": @(0xdc143c),
                    @"cyan": @(0x00ffff),
                    @"darkblue": @(0x00008b),
                    @"darkcyan": @(0x008b8b),
                    @"darkgoldenrod": @(0xb8860b),
                    @"darkgray": @(0xa9a9a9),
                    @"darkgreen": @(0x006400),
                    @"darkgrey": @(0xa9a9a9),
                    @"darkkhaki": @(0xbdb76b),
                    @"darkmagenta": @(0x8b008b),
                    @"darkolivegreen": @(0x556b2f),
                    @"darkorange": @(0xff8c00),
                    @"darkorchid": @(0x9932cc),
                    @"darkred": @(0x8b0000),
                    @"darksalmon": @(0xe9967a),
                    @"darkseagreen": @(0x8fbc8f),
                    @"darkslateblue": @(0x483d8b),
                    @"darkslategray": @(0x2f4f4f),
                    @"darkslategrey": @(0x2f4f4f),
                    @"darkturquoise": @(0x00ced1),
                    @"darkviolet": @(0x9400d3),
                    @"deeppink": @(0xff1493),
                    @"deepskyblue": @(0x00bfff),
                    @"dimgray": @(0x696969),
                    @"dimgrey": @(0x696969),
                    @"dodgerblue": @(0x1e90ff),
                    @"firebrick": @(0xb22222),
                    @"floralwhite": @(0xfffaf0),
                    @"forestgreen": @(0x228b22),
                    @"fuchsia": @(0xff00ff),
                    @"gainsboro": @(0xdcdcdc),
                    @"ghostwhite": @(0xf8f8ff),
                    @"gold": @(0xffd700),
                    @"goldenrod": @(0xdaa520),
                    @"gray": @(0x808080),
                    @"green": @(0x008000),
                    @"greenyellow": @(0xadff2f),
                    @"grey": @(0x808080),
                    @"honeydew": @(0xf0fff0),
                    @"hotpink": @(0xff69b4),
                    @"indianred": @(0xcd5c5c),
                    @"indigo": @(0x4b0082),
                    @"ivory": @(0xfffff0),
                    @"khaki": @(0xf0e68c),
                    @"lavender": @(0xe6e6fa),
                    @"lavenderblush": @(0xfff0f5),
                    @"lawngreen": @(0x7cfc00),
                    @"lemonchiffon": @(0xfffacd),
                    @"lightblue": @(0xadd8e6),
                    @"lightcoral": @(0xf08080),
                    @"lightcyan": @(0xe0ffff),
                    @"lightgoldenrodyellow": @(0xfafad2),
                    @"lightgray": @(0xd3d3d3),
                    @"lightgreen": @(0x90ee90),
                    @"lightgrey": @(0xd3d3d3),
                    @"lightpink": @(0xffb6c1),
                    @"lightsalmon": @(0xffa07a),
                    @"lightseagreen": @(0x20b2aa),
                    @"lightskyblue": @(0x87cefa),
                    @"lightslategray": @(0x778899),
                    @"lightslategrey": @(0x778899),
                    @"lightsteelblue": @(0xb0c4de),
                    @"lightyellow": @(0xffffe0),
                    @"lime": @(0x00ff00),
                    @"limegreen": @(0x32cd32),
                    @"linen": @(0xfaf0e6),
                    @"magenta": @(0xff00ff),
                    @"maroon": @(0x800000),
                    @"mediumaquamarine": @(0x66cdaa),
                    @"mediumblue": @(0x0000cd),
                    @"mediumorchid": @(0xba55d3),
                    @"mediumpurple": @(0x9370db),
                    @"mediumseagreen": @(0x3cb371),
                    @"mediumslateblue": @(0x7b68ee),
                    @"mediumspringgreen": @(0x00fa9a),
                    @"mediumturquoise": @(0x48d1cc),
                    @"mediumvioletred": @(0xc71585),
                    @"midnightblue": @(0x191970),
                    @"mintcream": @(0xf5fffa),
                    @"mistyrose": @(0xffe4e1),
                    @"moccasin": @(0xffe4b5),
                    @"navajowhite": @(0xffdead),
                    @"navy": @(0x000080),
                    @"oldlace": @(0xfdf5e6),
                    @"olive": @(0x808000),
                    @"olivedrab": @(0x6b8e23),
                    @"orange": @(0xffa500),
                    @"orangered": @(0xff4500),
                    @"orchid": @(0xda70d6),
                    @"palegoldenrod": @(0xeee8aa),
                    @"palegreen": @(0x98fb98),
                    @"paleturquoise": @(0xafeeee),
                    @"palevioletred": @(0xdb7093),
                    @"papayawhip": @(0xffefd5),
                    @"peachpuff": @(0xffdab9),
                    @"peru": @(0xcd853f),
                    @"pink": @(0xffc0cb),
                    @"plum": @(0xdda0dd),
                    @"powderblue": @(0xb0e0e6),
                    @"purple": @(0x800080),
                    @"rebeccapurple": @(0x663399),
                    @"red": @(0xff0000),
                    @"rosybrown": @(0xbc8f8f),
                    @"royalblue": @(0x4169e1),
                    @"saddlebrown": @(0x8b4513),
                    @"salmon": @(0xfa8072),
                    @"sandybrown": @(0xf4a460),
                    @"seagreen": @(0x2e8b57),
                    @"seashell": @(0xfff5ee),
                    @"sienna": @(0xa0522d),
                    @"silver": @(0xc0c0c0),
                    @"skyblue": @(0x87ceeb),
                    @"slateblue": @(0x6a5acd),
                    @"slategray": @(0x708090),
                    @"slategrey": @(0x708090),
                    @"snow": @(0xfffafa),
                    @"springgreen": @(0x00ff7f),
                    @"steelblue": @(0x4682b4),
                    @"tan": @(0xd2b48c),
                    @"teal": @(0x008080),
                    @"thistle": @(0xd8bfd8),
                    @"tomato": @(0xff6347),
                    @"turquoise": @(0x40e0d0),
                    @"violet": @(0xee82ee),
                    @"wheat": @(0xf5deb3),
                    @"white": @(0xffffff),
                    @"whitesmoke": @(0xf5f5f5),
                    @"yellow": @(0xffff00),
                    @"yellowgreen": @(0x9acd32)
            };
        });
    }

    return self;
}

+ (DFIColor *)colorWithFormat:(NSString *)format {
    DFIColor *color = [[DFIColor alloc] init];
    NSString *realFormat = [format lowercaseString];
    NSRange range = NSMakeRange(0, realFormat.length);

    unsigned long m;
    NSArray *matchResult;

    matchResult = [kReHex3 matchesInString:realFormat options:NSMatchingCompleted range:range];
    if (matchResult.count > 0) {
        NSTextCheckingResult *match = [matchResult firstObject];
        NSString *hexString = [realFormat substringWithRange:[match rangeAtIndex:1]];
        m = strtoul([hexString UTF8String], 0, 16);
        [color p_rgbOBJWithR:(m >> 8 & 0xf) | (m >> 4 & 0x0f0) g:(m >> 4 & 0xf) | (m & 0xf0) b:((m & 0xf) << 4) | (m & 0xf) andOpacity:1.0f];
        return color;
    }

    matchResult = [kReHex6 matchesInString:realFormat options:NSMatchingCompleted range:range];
    if (matchResult.count > 0) {
        NSTextCheckingResult *match = [matchResult firstObject];
        NSString *hexString = [realFormat substringWithRange:[match rangeAtIndex:1]];
        m = strtoul([hexString UTF8String], 0, 16);
        [color p_rgbOBJWithR:m >> 16 & 0xff g:m >> 8 & 0xff b:m & 0xff andOpacity:1.0f];
        return color;
    }

    if ([kNamed objectForKey:realFormat] != nil) {
        m = [[kNamed objectForKey:realFormat] intValue];
        [color p_rgbOBJWithR:m >> 16 & 0xff g:m >> 8 & 0xff b:m & 0xff andOpacity:1.0f];
        return color;
    }

    return nil;
}

- (DFIColor *)brighterWithK:(CGFloat)k {
    k = powf(DFIColorBrighter, k);
    return [[DFIColor alloc] initWithR:_r * k g:_g * k b:_b * k andOpacity:_opacity];
}

- (DFIColor *)darkerWithK:(CGFloat)k {
    k = powf(DFIColorDarker, k);
    return [[DFIColor alloc] initWithR:_r * k g:_g * k b:_b * k andOpacity:_opacity];
}

- (UIColor *)toUIColor {
    return [UIColor colorWithRed:_r / 255.0f green:_g / 255.0f blue:_b / 255.0f alpha:_opacity];
}

- (NSString *)toString {
    // TODO - deal with opacity
    return [NSString stringWithFormat:@"#%2X%2X%2X", (int)_r, (int)_g, (int)_b];
}


#pragma mark - Private Method
- (void)p_rgbOBJWithR:(CGFloat)r g:(CGFloat)g b:(CGFloat)b andOpacity:(CGFloat)opacity {
    _r = r;
    _g = g;
    _b = b;
    _opacity = opacity;
}


@end
