function Layout(Layers) {

    // Set shape of baseline values(ThemeRiver Version).
    var n = Layers[0].records.length,
        m = Layers.length,
        baseline = [],
        i = 0,
        j = 0;

    // ThemeRiver is perfectly symmetrical, the baseline is 1/2 of the total height at any point
    for (i = 0; i < n; i++) {
        baseline[i] = 0;
        for (j = 0; j < m; j++) {
            baseline[i] += Layers[j].records[i];
        }
        baseline[i] *= -0.5;
    }

    for (i = 0; i < Layers.length; i++) {
        Layers[i].yBottom = baseline;
        for (j = 0; j < baseline.length; j++) {
            baseline[j] += Layers[i].records[j];
        }
        Layers[i].yTop = baseline;
    }
}