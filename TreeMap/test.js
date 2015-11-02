function Squarify(d, num) {

    var sum,
        w1,
        w2,
        j = 0,
        s = 0;

    if (num == d.children.length) {
        return;
    }

    if (num == 0) {

        if (d.rect.w <= d.rect.h) {

            d.children[num].rect.ox = d.rect.ox;
            d.children[num].rect.oy = d.rect.oy;
            d.children[num].rect.w = d.rect.w;
            d.children[num].rect.h = d.children[num].rect.area / d.rect.w;

        } else {

            d.children[num].rect.ox = d.rect.ox;
            d.children[num].rect.oy = d.rect.oy;
            d.children[num].rect.h = d.rect.h;
            d.children[num].rect.w = d.children[num].rect.area / d.rect.h;

        }

        row[t++] = d.children[num].rect.area;
        num++;

        Squarify(d, num);

    }

    if (d.rect.w <= d.rect.h) {

        w1 = WorstRatio2(d, num, row);

        row[t++] = d.children[num].rect.area;

        w2 = WorstRatio2(d, num, row);

    } else {

        w1 = WorstRatio2(d, num, row);

        row[t++] = d.children[num].rect.area;

        w2 = WorstRatio2(d, num, row);

    }


    if (w1 <= w2) {

        for (j; row[j] !== undefined; j++) {
            s += row[j];
        }

        sum = s;

        for (j; j > 0; j--) {

            s -= d.children[num - j + 1].size;

            if (d.rect.w <= d.rect.h) {

                d.children[num - j + 1].rect.ox = d.rect.ox + d.rect.w * s / sum;
                d.children[num - j + 1].rect.oy = d.rect.oy;
                d.children[num - j + 1].rect.w = d.rect.w * d.children[num - j + 1].size / sum;
                d.children[num - j + 1].rect.h = d.children[num - j + 1].area / d.children[num - j + 1].rect.w;

            } else {

                d.children[num - j + 1].rect.oy = d.rect.oy + d.rect.h * s / sum;
                d.children[num - j + 1].rect.ox = d.rect.ox;
                d.children[num - j + 1].rect.h = d.rect.h * d.children[num - j + 1].size / sum;
                d.children[num - j + 1].rect.w = d.children[num - j + 1].rect.area / d.children[num - j + 1].rect.h;

            }
        }

        num++;

        Squarify(d, num);

    } else {

        if (d.rect.w <= d.rect.h) {

            d.children[num].oy = d.rect.oy + d.children[num - 1].rect.h;
            d.children[num].ox = d.rect.ox;
            d.children[num].w = d.rect.w;
            d.children[num].h = d.children[num].rect.area / d.rect.w;

            d.rect.h = d.rect.h - d.children[num - 1].rect.h;
            d.rect.oy = d.rect.oy + d.children[num - 1].rect.h;

        } else {

            d.children[num].ox = d.rect.ox + row[0].rect.h;
            d.children[num].oy = d.rect.oy;
            d.children[num].h = d.rect.h;
            d.children[num].w = d.children[num].rect.area / d.rect.h;

            d.rect.w = d.rect.w - d.children[num - 1].rect.w;
            d.rect.ox = d.rect.ox + d.children[num - 1].rect.w;

        }

        row = {};
        t = 0;

        row[t++] = d.children[num].rect.area;

        d.rect.ox = row[0].rect.ox;
        d.rect.oy = row[0].rect.oy;

        num++;

        Squarify(d, num);

    }
}

function Worst(R, w) {

    var r1,
        r2,
        j,
        s = 0;

    for (j = 0; R[j] !== undefined; j++) {
        s += R[j];
    }

    r1 = Math.pow(w / s, 2) * R[0];

    r2 = Math.pow(s / w, 2) / R[j - 1];

    return Math.max(r1, r2);

}