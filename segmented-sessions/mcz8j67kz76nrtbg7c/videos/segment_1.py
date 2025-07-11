from manim import *

class StableMatchingScene(Scene):
    def construct(self):
        title = Text("Stable Matching", font_size=72)
        subtitle = Text("Algorithms, Applications, and the Power of Careful Modeling", font_size=36)
        
        title.set_color(BLUE)
        subtitle.set_color(GREEN)

        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(subtitle))
        self.wait(4.3)

        self.clear()