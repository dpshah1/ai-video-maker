from manim import *

class ResidencyMatch(Scene):
    def construct(self):
        title = Text("A Real-World Romance: The Residency Match", font_size=36)
        title.set_color(YELLOW)
        title.move_to(ORIGIN)

        self.play(Write(title))
        self.wait(3)